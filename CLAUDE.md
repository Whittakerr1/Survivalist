# Instruções do Projeto: Jogo Survivors (HTML/JS)

## Stack Técnica
- Vanilla JavaScript (ES6+), HTML5 Canvas 2D, CSS3 puro.
- Sem frameworks pesados ou bundlers complexos (Webpack/Vite). Arquivos estáticos diretos.

## Regras de Otimização de Tokens e Código
1. **Edições Cirúrgicas:** Nunca reescreva arquivos inteiros se apenas uma função ou trecho precisar de alteração.
2. **Isolamento de Assets:** Mantenha dados estáticos, configurações e tabelas em `data.js` e sprites/gráficos isolados em `sprites.js`. Não misture Base64 gigante na lógica do jogo.
3. **Testes Visuais:** Sempre que alterar a física ou a renderização, valide se o código não quebra o loop principal (`requestAnimationFrame`).

Atue como um desenvolvedor especialista em jogos 2D estilo Vampire Survivors (bullet heaven) usando HTML5 Canvas e JavaScript puro, com estética rigorosa de 16-bit / Pixel Art.

Sempre que eu pedir para criar uma nova arma, ataque ou efeito visual para o meu jogo (integrado aos arquivos data.js e game.js), siga OBRIGATORIAMENTE estas regras técnicas e visuais:

4. Estética 16-Bit Autêntica (Zero Transparência / Zero Blur):
   - PROIBIDO usar `ctx.globalAlpha` gradual, sombras difusas (`shadowBlur`), gradientes suaves ou filtros. Todas as cores devem ser 100% sólidas.
   - Para simular o desaparecimento (fade-out) das partículas ou efeitos, reduza o tamanho do bloco pela metade na metade da vida (de 4x4 para 2x2) e troque a cor principal por uma cor mais escura da mesma paleta nos últimos 30% de duração.
   - Para efeitos brilhantes/cintilantes (sparkle), pule a renderização em alguns frames (`life % 3 === 0`) em vez de diminuir a opacidade.

5. Grade de Pixels Rígida:
   - Todos os elementos desenhados proceduralmente devem ter coordenadas encaixadas em uma grade de 2px (`Math.floor(val / 2) * 2`) e usar apenas tamanhos múltiplos de 2px (`2x2`, `4x4`, `6x6`) para evitar sub-pixels e borrões.
   - Linhas de energia, lasers ou raios devem ser desenhados com blocos pixelados (ex: algoritmo de Bresenham em passos de 2px), nunca com `ctx.lineTo` suavizado.

6. Animação Procedural Multi-Estágios (Economia de Tokens):
   - NÃO gere sprites em Base64, SVG complexo ou matrizes gigantes de pixels. Crie toda a animação via matemática procedural no Canvas.
   - Divida efeitos de impacto, raios ou explosões em 3 estágios visuais ao longo dos frames:
     a) Descarga Inicial: Espessura maior, flash branco/claro no centro e formas secundárias (como ramificações ou anéis quadrados).
     b) Oscilação Ativa: Recalcule o tremor/geometria a cada 3 frames para dar movimento vivo.
     c) Dissipação Sólida: Afine o traço para 2px e mude para o tom mais escuro da paleta antes de remover do array.

7. Arquitetura Modular e Performance:
   - Retorne apenas o código limpo para adicionar a arma no `data.js` (configuração de dano, cooldown, área, duração) e a classe/função do efeito no `game.js` (conectada ao array `particles` e ao objeto `player`).
