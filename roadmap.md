# ROADMAP - Survivors

## Objetivo Atual (Refatoracao e Assets)
- [ ] **Modularizar o codigo no GitHub:** Codigo modularizado localmente (`index.html`, `style.css`, `data.js`, `sprites.js`, `game.js`) e testado. Falta apenas enviar os arquivos ao GitHub (git add/commit/push).
- [ ] **Sincronizar e aplicar tilesets de mapas:** Ler os sprites locais em `/home/whittaker/Games/Survivors/Assets/mapas/`, enviar para a pasta `Assets/mapas/` no repositorio do GitHub e atualizar os dois mapas do jogo para usar esses arquivos locais em vez de geracao/Base64.

## Proximas Funcionalidades
- [ ] [Mecanica 1]: Breve descricao.
- [ ] [Mecanica 2]: Breve descricao.

## Em Andamento
- [ ] Enviar a versao modular ao GitHub (push local).

## Bugs e Correcoes
- [ ] Descricao do erro.

## Concluido
- [x] Configuracao de ambiente e MCPs (Filesystem e GitHub).
- [x] Modularizacao local: `style.css`, `sprites.js` (7 strings Base64, ~2,9 MB), `data.js` (23 constantes) e `game.js` (~115 KB). Jogo testado e funcionando. Backups: `index.backup.html`, `game.backup.js`. Scripts usados: `split_game.py`, `extract_assets.py`.
