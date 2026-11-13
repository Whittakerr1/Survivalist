# Roadmap — Survivalist

> Regra de trabalho: **uma tarefa por vez**, sempre a primeira pendente da lista.
> Ao concluir, marcar `[x]` e registrar em "Histórico".

## Contexto
- Hoje o jogo inteiro vive em `index.html` (~3,1 MB). Isso torna cada leitura/edição cara em tokens.
- Objetivo: separar lógica, dados e assets em arquivos menores, para editar de forma cirúrgica.

## Próximos passos (em ordem)
- [ ] 1. Mapear `index.html`: localizar blocos de CSS, HTML, lógica JS, dados/configs e sprites (strings base64 etc.) e anotar aqui as linhas/seções.
- [ ] 2. Extrair sprites e strings estáticas pesadas para `sprites.js`.
- [ ] 3. Extrair configurações e dados do jogo (inimigos, armas, upgrades, balanceamento) para `data.js`.
- [ ] 4. Extrair a lógica do jogo para `game.js`.
- [ ] 5. Extrair o CSS para `style.css`.
- [ ] 6. Reduzir `index.html` a um esqueleto que carrega `style.css`, `sprites.js`, `data.js` e `game.js` (nessa ordem).
- [ ] 7. Testar o jogo após a refatoração e corrigir regressões.

## Feito
- [x] `roadmap.md` criado.

## Histórico
- Criação do roadmap. `index.html` ainda não foi lido nem alterado.
