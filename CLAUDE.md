# Instruções do Projeto: Jogo Survivors (HTML/JS)

## Stack Técnica
- Vanilla JavaScript (ES6+), HTML5 Canvas 2D, CSS3 puro.
- Sem frameworks pesados ou bundlers complexos (Webpack/Vite). Arquivos estáticos diretos.

## Regras de Otimização de Tokens e Código
1. **Edições Cirúrgicas:** Nunca reescreva arquivos inteiros se apenas uma função ou trecho precisar de alteração.
2. **Isolamento de Assets:** Mantenha dados estáticos, configurações e tabelas em `data.js` e sprites/gráficos isolados em `sprites.js`. Não misture Base64 gigante na lógica do jogo.
3. **Testes Visuais:** Sempre que alterar a física ou a renderização, valide se o código não quebra o loop principal (`requestAnimationFrame`).
