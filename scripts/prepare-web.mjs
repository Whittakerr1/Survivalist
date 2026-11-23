// Copia só os arquivos do jogo para dist-web/ (usado pelo Tauri como frontendDist).
// Mantém a raiz do repositório intacta, então o deploy no GitHub Pages continua igual.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist-web');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const f of ['index.html', 'style.css', 'sprites.js', 'data.js', 'evo.js', 'maps.js', 'enemies.js', 'game.js']) {
  cpSync(join(root, f), join(out, f));
}
cpSync(join(root, 'Assets'), join(out, 'Assets'), { recursive: true });

console.log('dist-web/ pronto');
