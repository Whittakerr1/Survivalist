import base64, glob, shutil, os
D = 'Assets/Personagens/Personagens Atuais/mrworldwide/'
fs = sorted(glob.glob(D + 'sprite_*.png'))
assert len(fs) == 12, 'esperava 12 sprites, achei %d' % len(fs)
shutil.copy('sprites.js', 'sprites.backup3.js')
lines = [l for l in open('sprites.js', encoding='utf-8').read().split('\n') if not l.startswith('const SPR_25=')]
src = [('data:image/png;base64,' + base64.b64encode(open(f, 'rb').read()).decode()) for f in fs]
lines = [l for l in lines if not l.startswith('const SPR_MRWW=')]
lines.append('const SPR_MRWW=' + repr(src).replace("'", '"') + ';')
open('sprites.js', 'w', encoding='utf-8').write('\n'.join(lines))
print('ok:', os.path.getsize('sprites.js') // 1024, 'KB')
