# ROADMAP - Survivors

## Objetivo Atual (Refatoracao e Assets)
- [x] **Modularizar o codigo no GitHub:** modularizado localmente, testado e enviado ao GitHub (verificado).

## Proximas Funcionalidades
- [ ] [Mecanica 1]: Breve descricao.
- [ ] [Mecanica 2]: Breve descricao.

## Em Andamento
- [ ] Tilesets Cidadela: baus quebraveis ja usam `sprite_0039/0043/0040/0045.png` (variacao aleatoria, `CIDB` em data.js, `cityBox` em game.js). Falta testar no navegador. Cenario (chao, calcada, predios, muros, cercas, lixo) aguardando o mapeamento arquivo -> elemento.
- [ ] Proxima: mover Base64 pequeno que sobrou (ATLU e ZU em data.js; personagens, icones, tileset em game.js) para sprites.js (baixar o limite de 20 KB do extract_assets.py).

## Bugs e Correcoes
- [ ] Descricao do erro.

## Concluido
- [x] Configuracao de ambiente e MCPs (Filesystem e GitHub).
- [x] Modularizacao local: `style.css`, `sprites.js` (7 strings Base64, ~2,9 MB), `data.js` (23 constantes) e `game.js` (~115 KB). Jogo testado e funcionando. Backups: `index.backup.html`, `game.backup.js`. Scripts usados: `split_game.py`, `extract_assets.py`.
