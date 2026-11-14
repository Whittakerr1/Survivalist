#!/usr/bin/env python3
"""Terceira etapa: move os data URIs pequenos (>= 300 chars) de game.js e data.js para sprites.js.

Uso (na pasta do jogo, junto com split_game.py):
  python3 extract_small_assets.py            # simulação (nada é gravado)
  python3 extract_small_assets.py --apply    # grava (backups: *.backup2.*)

- Cada string "data:..." grande vira `const SPR_n=...;` ao FINAL do sprites.js (n continua de onde parou).
- No game.js / data.js a string é trocada por SPR_n.
- Ordem de carregamento no index.html permanece: sprites.js -> data.js -> game.js
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path

from split_game import mask

ROOT = Path(__file__).resolve().parent
SPR = ROOT / "sprites.js"
TARGETS = [ROOT / "data.js", ROOT / "game.js"]
MIN = 300


def kb(n):
    return f"{n / 1024:,.1f} KB"


def main():
    apply = "--apply" in sys.argv
    sprites = SPR.read_text(encoding="utf-8")
    nums = [int(x) for x in re.findall(r"const SPR_(\d+)=", sprites)]
    n = max(nums) if nums else 0
    first = n + 1
    new_defs, results = [], []

    for path in TARGETS:
        js = path.read_text(encoding="utf-8")
        masked = mask(js)
        parts, last, moved = [], 0, 0
        for m in re.finditer(r"(['\"`])[ \n]{%d,}\1" % MIN, masked):
            lit = js[m.start():m.end()]
            if not lit[1:].startswith("data:"):
                continue
            n += 1
            new_defs.append(f"const SPR_{n}={lit};\n")
            parts.append(js[last:m.start()])
            parts.append(f"SPR_{n}")
            last = m.end()
            moved += 1
        parts.append(js[last:])
        results.append((path, js, "".join(parts), moved))

    print("=== PLANO ===")
    for path, old, new, moved in results:
        print(f"{path.name:10}: {kb(len(old.encode()))} -> {kb(len(new.encode()))}  ({moved} string(s) movida(s))")
    added = "".join(new_defs)
    print(f"sprites.js: +{kb(len(added.encode()))}  (SPR_{first} a SPR_{n})")
    if n < first:
        print("Nada a mover.")
        return
    if not apply:
        print("\nSimulação concluída. Rode com --apply para gravar.")
        return

    for p in [SPR] + TARGETS:
        b = p.with_name(p.stem + ".backup2" + p.suffix)
        if b.exists():
            sys.exit(f"{b.name} já existe; mova-o antes para não perder o backup.")
    for p in [SPR] + TARGETS:
        shutil.copy2(p, p.with_name(p.stem + ".backup2" + p.suffix))
    if not sprites.endswith("\n"):
        sprites += "\n"
    SPR.write_text(sprites + added, encoding="utf-8")
    for path, _, new, _ in results:
        path.write_text(new, encoding="utf-8")
    print("\nGravado. Backups: sprites.backup2.js, data.backup2.js, game.backup2.js")

    if shutil.which("node"):
        for p in [SPR] + TARGETS:
            r = subprocess.run(["node", "--check", str(p)], capture_output=True, text=True)
            print(f"node --check {p.name}: {'OK' if r.returncode == 0 else 'ERRO'}")
            if r.returncode:
                print(r.stderr[:500])
    else:
        print("node não encontrado; abra o jogo e confira o console (F12).")


if __name__ == "__main__":
    main()
