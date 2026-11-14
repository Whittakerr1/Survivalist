#!/usr/bin/env python3
"""Divide o index.html em style.css, sprites.js, data.js e game.js.

Uso (na pasta do jogo):
  python3 split_game.py            # simulação: mostra o plano, não grava nada
  python3 split_game.py --apply    # grava os arquivos (faz backup do index.html)

Regras:
  - sprites.js : declarações top-level CHARS e SL (+ qualquer const/let/var com Base64 enorme)
  - data.js    : declarações top-level em MAIÚSCULAS, só com dados (sem funções/chamadas)
  - game.js    : todo o resto do <script> principal
  - style.css  : conteúdo dos <style>
Ordem de carregamento no index.html: sprites.js -> data.js -> game.js
"""
import re
import shutil
import subprocess
import sys
import time
from array import array
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "index.html"
SPRITE_NAMES = {"CHARS", "SL"}
BIG = 20000  # statements com Base64 acima disso vão para sprites.js
DECL = re.compile(r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=")
IDENT = re.compile(r"[A-Za-z_$][\w$]*")
UPPER = re.compile(r"^[A-Z][A-Z0-9_]*$")
REGEX_PREV = set("(,=:[!&|?{};")


def blank(out, a, b):
    for k in range(a, b):
        if out[k] != "\n":
            out[k] = " "


def skip_template(js, i):
    n, j = len(js), i + 1
    while j < n:
        c = js[j]
        if c == "\\":
            j += 2
            continue
        if c == "`":
            return j + 1
        if c == "$" and j + 1 < n and js[j + 1] == "{":
            j += 2
            d = 1
            while j < n and d:
                ch = js[j]
                if ch == "`":
                    j = skip_template(js, j)
                    continue
                if ch in "'\"":
                    k = j + 1
                    while k < n and js[k] != ch:
                        k += 2 if js[k] == "\\" else 1
                    j = k + 1
                    continue
                if ch == "{":
                    d += 1
                elif ch == "}":
                    d -= 1
                j += 1
            continue
        j += 1
    return n


def mask(js):
    """Troca strings, comentários e regex por espaços (mesmo tamanho)."""
    out = list(js)
    n, i, prev = len(js), 0, ""
    while i < n:
        c = js[i]
        nxt = js[i + 1] if i + 1 < n else ""
        if c == "/" and nxt == "/":
            j = js.find("\n", i)
            j = n if j < 0 else j
            blank(out, i, j)
            i = j
            continue
        if c == "/" and nxt == "*":
            j = js.find("*/", i + 2)
            j = n if j < 0 else j + 2
            blank(out, i, j)
            i = j
            continue
        if c in "'\"":
            j = i + 1
            while j < n and js[j] != c and js[j] != "\n":
                j += 2 if js[j] == "\\" else 1
            j = min(j + 1, n)
            blank(out, i + 1, max(i + 1, j - 1))
            prev, i = c, j
            continue
        if c == "`":
            j = skip_template(js, i)
            blank(out, i + 1, max(i + 1, j - 1))
            prev, i = c, j
            continue
        if c == "/" and (prev == "" or prev in REGEX_PREV):
            j, in_cls = i + 1, False
            while j < n and js[j] != "\n":
                if js[j] == "\\":
                    j += 2
                    continue
                if js[j] == "[":
                    in_cls = True
                elif js[j] == "]":
                    in_cls = False
                elif js[j] == "/" and not in_cls:
                    break
                j += 1
            j = min(j + 1, n)
            blank(out, i + 1, max(i + 1, j - 1))
            prev, i = "a", j
            continue
        if not c.isspace():
            prev = c
        i += 1
    return "".join(out)


def depth_map(masked):
    d, arr = 0, array("i", [0]) * len(masked)
    for i, c in enumerate(masked):
        if c in ")}]":
            d -= 1
        arr[i] = d
        if c in "({[":
            d += 1
    return arr


def find_statements(js):
    masked = mask(js)
    depth = depth_map(masked)
    stmts, pos = [], 0
    for m in DECL.finditer(masked):
        s = m.start()
        if s < pos or depth[s] != 0:
            continue
        d, j, n = 0, m.end(), len(masked)
        while j < n:
            c = masked[j]
            if c in "({[":
                d += 1
            elif c in ")}]":
                if d == 0:
                    break
                d -= 1
            elif c == ";" and d == 0:
                j += 1
                break
            j += 1
        while j < n and js[j] in " \t\r\n":
            j += 1
        stmts.append({"s": s, "e": j, "name": m.group(1), "text": js[s:j], "code": masked[s:j]})
        pos = j
    return stmts


def classify(stmts):
    for st in stmts:
        code = st["code"]
        pure = not re.search(r"\(|=>|\bfunction\b|\bclass\b|\bnew\b", code)
        if st["name"] in SPRITE_NAMES or (len(st["text"]) > BIG and "base64," in st["text"]):
            st["dest"] = "sprites"
            st["warn"] = None if pure else "contém chamadas/funções (pode depender de código do jogo)"
        elif UPPER.match(st["name"]) and pure:
            st["dest"] = "data"
        else:
            st["dest"] = "game"
    changed = True
    while changed:  # dados que dependem de nomes que ficaram no game voltam pro game
        changed = False
        game_names = {s["name"] for s in stmts if s["dest"] == "game"}
        for st in stmts:
            if st["dest"] == "game" or st.get("warn"):
                continue
            if st["name"] in SPRITE_NAMES and st["dest"] == "sprites":
                continue
            if (set(IDENT.findall(st["code"])) - {st["name"]}) & game_names:
                st["dest"] = "game"
                changed = True


def main():
    apply = "--apply" in sys.argv
    if not SRC.exists():
        sys.exit(f"Não achei {SRC}")
    html = SRC.read_text(encoding="utf-8")

    scripts = [m for m in re.finditer(r"<script(?P<a>[^>]*)>(?P<b>.*?)</script>", html, re.S | re.I)
               if "src=" not in m.group("a").lower()]
    if not scripts:
        sys.exit("Nenhum <script> inline encontrado.")
    main_m = max(scripts, key=lambda m: len(m.group("b")))
    if "module" in main_m.group("a").lower():
        sys.exit("O script principal é type=module; o escopo mudaria. Abortando.")
    js = main_m.group("b")

    stmts = find_statements(js)
    classify(stmts)
    parts = {"sprites": [], "data": [], "game": []}
    for st in stmts:
        if st["dest"] != "game":
            parts[st["dest"]].append(st)
    game_js, last = [], 0
    for st in stmts:
        if st["dest"] != "game":
            game_js.append(js[last:st["s"]])
            last = st["e"]
    game_js.append(js[last:])
    game_js = "".join(game_js)
    sprites_js = "".join(s["text"] if s["text"].endswith("\n") else s["text"] + "\n" for s in parts["sprites"])
    data_js = "".join(s["text"] if s["text"].endswith("\n") else s["text"] + "\n" for s in parts["data"])

    styles = list(re.finditer(r"<style[^>]*>(?P<b>.*?)</style>", html, re.S | re.I))
    css = "\n".join(m.group("b").strip("\n") for m in styles) + ("\n" if styles else "")

    tags = []
    if sprites_js:
        tags.append('<script src="sprites.js"></script>')
    if data_js:
        tags.append('<script src="data.js"></script>')
    tags.append('<script src="game.js"></script>')

    # monta o novo index.html (de trás pra frente para não bagunçar índices)
    edits = [(main_m.start(), main_m.end(), "\n".join(tags))]
    for k, m in enumerate(styles):
        edits.append((m.start(), m.end(), '<link rel="stylesheet" href="style.css">' if k == 0 else ""))
    new_html = html
    for a, b, rep in sorted(edits, reverse=True):
        new_html = new_html[:a] + rep + new_html[b:]

    kb = lambda t: f"{len(t.encode('utf-8')) / 1024:,.1f} KB"
    print("=== PLANO ===")
    print(f"index.html (original) : {kb(html)}")
    print(f"index.html (novo)     : {kb(new_html)}")
    print(f"style.css             : {kb(css)}")
    print(f"sprites.js            : {kb(sprites_js)}  -> {[s['name'] for s in parts['sprites']]}")
    print(f"data.js               : {kb(data_js)}  -> {[s['name'] for s in parts['data']]}")
    print(f"game.js               : {kb(game_js)}")
    for s in parts["sprites"]:
        if s.get("warn"):
            print(f"AVISO: {s['name']} {s['warn']}")
    missing = SPRITE_NAMES - {s["name"] for s in parts["sprites"]}
    if missing:
        print(f"AVISO: não encontrei declaração top-level de {sorted(missing)} (talvez dentro de função/objeto).")
    if len(js) != len(game_js) + sum(len(s["text"]) for s in stmts if s["dest"] != "game"):
        sys.exit("Falha na checagem de integridade. Nada foi gravado.")

    if not apply:
        print("\nSimulação concluída. Rode com --apply para gravar.")
        return

    outs = {"style.css": css, "sprites.js": sprites_js, "data.js": data_js, "game.js": game_js}
    for name, content in outs.items():
        if content and (ROOT / name).exists() and "--force" not in sys.argv:
            sys.exit(f"{name} já existe. Use --force para sobrescrever.")
    backup = ROOT / "index.backup.html"
    if backup.exists():
        backup = ROOT / f"index.backup.{int(time.time())}.html"
    shutil.copy2(SRC, backup)
    for name, content in outs.items():
        if content:
            (ROOT / name).write_text(content, encoding="utf-8")
    SRC.write_text(new_html, encoding="utf-8")
    print(f"\nGravado. Backup do original: {backup.name}")

    if shutil.which("node"):
        for name in ("sprites.js", "data.js", "game.js"):
            if (ROOT / name).exists():
                r = subprocess.run(["node", "--check", str(ROOT / name)], capture_output=True, text=True)
                print(f"node --check {name}: {'OK' if r.returncode == 0 else 'ERRO'}")
                if r.returncode:
                    print(r.stderr[:500])
    else:
        print("node não encontrado; abra o jogo no navegador e confira o console (F12).")


if __name__ == "__main__":
    main()
