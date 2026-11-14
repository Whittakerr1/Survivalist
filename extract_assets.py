#!/usr/bin/env python3
"""Segunda etapa: extrai assets pesados do game.js (que está dentro de um IIFE).

Uso (na pasta do jogo, junto com split_game.py):
  python3 extract_assets.py            # simulação
  python3 extract_assets.py --apply    # grava (backup em game.backup.js)

- Toda string literal gigante (> 20 KB, ex.: Base64 de sprites) vai para sprites.js
  como `const SPR_1=...;` e, no game.js, é trocada por `SPR_1`.
- Constantes MAIÚSCULAS só de dados (ex.: CHARS) vão para data.js.
- O index.html passa a carregar: sprites.js -> data.js -> game.js
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path

from split_game import DECL, IDENT, UPPER, depth_map, mask

ROOT = Path(__file__).resolve().parent
GAME = ROOT / "game.js"
INDEX = ROOT / "index.html"
BIG = 20000
IMPURE = re.compile(r"\(|=>|\bfunction\b|\bclass\b|\bnew\b")


def stmt_end(js, masked, j):
    d, n = 0, len(masked)
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
    return j


def kb(t):
    return f"{len(t.encode('utf-8')) / 1024:,.1f} KB"


def main():
    apply = "--apply" in sys.argv
    js = GAME.read_text(encoding="utf-8")

    # 1) strings gigantes -> sprites.js
    masked = mask(js)
    heavy = list(re.finditer(r"(['\"`])[ \n]{%d,}\1" % BIG, masked))
    sprites, parts, last = [], [], 0
    for i, m in enumerate(heavy, 1):
        sprites.append(f"const SPR_{i}={js[m.start():m.end()]};\n")
        parts.append(js[last:m.start()])
        parts.append(f"SPR_{i}")
        last = m.end()
    parts.append(js[last:])
    js2 = "".join(parts)
    sprites_js = "".join(sprites)

    # 2) dados puros em MAIÚSCULAS -> data.js
    m2 = mask(js2)
    dep = depth_map(m2)
    first = DECL.search(m2)
    if not first:
        sys.exit("Nenhuma declaração encontrada no game.js.")
    target = dep[first.start()]
    stmts, pos = [], 0
    for m in DECL.finditer(m2):
        s = m.start()
        if s < pos or dep[s] != target:
            continue
        e = stmt_end(js2, m2, m.end())
        stmts.append({"s": s, "e": e, "name": m.group(1), "text": js2[s:e], "code": m2[s:e], "data": False})
        pos = e
    for st in stmts:
        st["data"] = bool(UPPER.match(st["name"])) and not IMPURE.search(st["code"])
    fn_names = set(re.findall(r"\bfunction\s+([A-Za-z_$][\w$]*)", m2))
    changed = True
    while changed:
        changed = False
        game_names = {s["name"] for s in stmts if not s["data"]} | fn_names
        for st in stmts:
            if st["data"] and (set(IDENT.findall(st["code"])) - {st["name"]}) & game_names:
                st["data"] = False
                changed = True
    moved = [s for s in stmts if s["data"]]
    game_parts, last = [], 0
    for st in moved:
        game_parts.append(js2[last:st["s"]])
        last = st["e"]
    game_parts.append(js2[last:])
    game_new = "".join(game_parts)
    data_js = "".join(s["text"] if s["text"].endswith("\n") else s["text"] + "\n" for s in moved)

    print("=== PLANO ===")
    print(f"profundidade do corpo do IIFE : {target}")
    print(f"game.js  : {kb(js)} -> {kb(game_new)}")
    print(f"sprites.js: {kb(sprites_js)} ({len(heavy)} string(s) gigante(s))")
    print(f"data.js  : {kb(data_js)} -> {[s['name'] for s in moved]}")
    if not heavy:
        print("AVISO: nenhuma string > 20 KB encontrada.")
    if not apply:
        print("\nSimulação concluída. Rode com --apply para gravar.")
        return

    for name in ("sprites.js", "data.js"):
        if (ROOT / name).exists():
            sys.exit(f"{name} já existe; remova-o antes.")
    backup = ROOT / "game.backup.js"
    if backup.exists():
        sys.exit("game.backup.js já existe; mova-o antes para não perder o backup.")
    shutil.copy2(GAME, backup)
    if sprites_js:
        (ROOT / "sprites.js").write_text(sprites_js, encoding="utf-8")
    if data_js:
        (ROOT / "data.js").write_text(data_js, encoding="utf-8")
    GAME.write_text(game_new, encoding="utf-8")

    html = INDEX.read_text(encoding="utf-8")
    tags = []
    if sprites_js:
        tags.append('<script src="sprites.js"></script>')
    if data_js:
        tags.append('<script src="data.js"></script>')
    tags.append('<script src="game.js"></script>')
    if '<script src="game.js"></script>' not in html:
        sys.exit("Não achei a tag do game.js no index.html (arquivos já gravados).")
    INDEX.write_text(html.replace('<script src="game.js"></script>', "\n".join(tags), 1), encoding="utf-8")
    print("\nGravado. Backup: game.backup.js")

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
