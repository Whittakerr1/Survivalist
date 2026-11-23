// Sprites dos inimigos dos mapas tematicos (carregado depois de maps.js e antes de game.js).
// Pintor: p(R,E,f,d) -> f = quadro 0..3 (ciclo de caminhada) e d = vista: 0 frente (desce), 1 costas (sobe), 2 perfil virado para a DIREITA (a esquerda e o espelho, feito em nmSpr).
// 100% procedural, cores solidas (1px do sprite = 2px na tela). No fim do arquivo cada pintor substitui o p do inimigo em NM e liga d.D=1 (4 quadros x 3 vistas).
const NSY=(R,S)=>(x,y,w,h,k)=>{R(x,y,w,h,k);R(S-x-w,y,w,h,k)};
const NME={deserto:{},tundra:{},pantano:{},vulcao:{},abismo:{}};
// esqueleto de bruto 16x16 (cabeca, tronco, bracos, pernas). P: K contorno, A corpo, B luz, C sombra; dc(R,Y,y,d,f,g) = detalhes de cada vista
function NMbrute(R,f,d,P){
 const Y=NSY(R,16),K=P.K,A=P.A,B=P.B,C=P.C,y=(f&1)?0:1,g=[1,0,-1,0][f],ll=f===1?1:0,rl=f===3?1:0,lt=y+11;
 if(d===2){
  R(5+g*2,y+6,3,6,K);R(6+g*2,y+7,1,4,C);
  R(5-g*2,lt,3,16-ll-lt,K);R(6-g*2,lt,1,15-ll-lt,C);
  R(8+g*2,lt,3,16-rl-lt,K);R(9+g*2,lt,1,15-rl-lt,A);
  R(4,y+5,8,7,K);R(5,y+5,6,6,A);R(5,y+5,6,1,B);R(5,y+9,6,1,C);
  R(8-g*2,y+6,3,6,K);R(9-g*2,y+7,1,4,A);R(9-g*2,y+7,1,1,B);
  R(6,y,8,5,K);R(7,y+1,6,3,A);R(7,y+1,6,1,B)
 }else{
  R(3,lt,4,16-ll-lt,K);R(4,lt,2,15-ll-lt,A);R(9,lt,4,16-rl-lt,K);R(10,lt,2,15-rl-lt,A);
  R(2,y+5,12,7,K);R(3,y+5,10,6,A);R(3,y+5,10,1,B);R(3,y+9,10,1,C);
  R(0,y+6+g,3,6,K);R(1,y+7+g,1,4,A);R(1,y+7+g,1,1,B);R(13,y+6-g,3,6,K);R(14,y+7-g,1,4,C);
  R(4,y,8,5,K);R(5,y+1,6,3,A);R(5,y+1,6,1,B)
 }
 P.dc(R,Y,y,d,f,g)}
// esqueleto de quadrupede (lobo e cao): 4 patas em trote, cabeca, cauda. P: K,W (pelo),G (sombra),Ey (olho), dc(R,Y,f,d,bb)
function NMdog(R,f,d,P){
 const Y=NSY(R,16),K=P.K,W=P.W,G=P.G,bb=(f&1)?-1:0,tw=[0,-1,0,1][f],ll=f===1?1:0,rl=f===3?1:0;
 if(d===2){
  [[3,0],[5,2],[9,2],[11,0]].forEach(([x,ph],i)=>{const q=(f+ph)&3,sx=[-1,0,1,0][q],li=q===1?1:0;R(x+sx,11,2,4-li,K);R(x+sx,11,1,3-li,i%2?G:W)});
  E_(R,7,9+bb,5,3,K);E_(R,7,9+bb,4,2,W);R(3,10+bb,6,1,G);
  R(11,5+bb,4,4,K);R(12,6+bb,3,2,W);R(15,7+bb,1,2,K);R(11,3+bb,1,3,K);R(13,3+bb,1,2,K);R(13,6+bb,1,1,P.Ey);R(13,9+bb,1,1,'#ffffff');
  R(0,6+bb+tw,3,3,K);R(1,6+bb+tw,2,2,W)
 }else if(d===0){
  R(4,11,3,4-ll,K);R(5,11,1,3-ll,W);R(9,11,3,4-rl,K);R(10,11,1,3-rl,W);
  R(5,9+bb,6,3,K);R(6,9+bb,4,2,W);
  Y(4,0+bb,2,3,K);Y(5,1+bb,1,2,G);R(4,2+bb,8,7,K);R(5,3+bb,6,5,W);Y(5,5+bb,1,1,P.Ey);R(7,7+bb,2,1,K);Y(6,8+bb,1,1,'#ffffff')
 }else{
  R(4,11,3,4-ll,K);R(5,11,1,3-ll,W);R(9,11,3,4-rl,K);R(10,11,1,3-rl,W);
  R(4,8+bb,8,5,K);R(5,8+bb,6,4,W);R(5,10+bb,6,1,G);
  R(7+tw,9+bb,2,5,K);R(7+tw,9+bb,1,4,W);
  Y(4,0+bb,2,3,K);Y(5,1+bb,1,2,G);R(4,2+bb,8,6,K);R(5,3+bb,6,4,W);R(6,5+bb,4,2,G)
 }
 P.dc(R,Y,f,d,bb)}
const E_=(R,X,Y0,rx,ry,k)=>{for(let j=-ry;j<=ry;j++){const q=Math.round(rx*Math.sqrt(Math.max(0,1-j*j/((ry*ry)||1))));R(X-q,Y0+j,2*q+1,1,k)}};

// ---------------------------------------------------------------- DESERTO
NME.deserto.esc=(R,E,f,d)=>{const K='#3a1a10',B='#c2552b',L='#f08a4a',D='#8a3a1a',Yw='#ffe14d',Y=NSY(R,16),t=[0,1,0,-1][f],o=f&1;
 if(d===2){
  for(let i=0;i<4;i++)R(4+i*2,12,1,2+((i+f)&1),K);
  R(1,9,3,2,K);R(0,6,3,4,K);R(1,3,4,4,K);R(4+t,2,3,2,K);R(1,7,1,2,B);R(2,4,2,2,B);R(6+t,4,1,2,Yw);
  E(7,10,5,3,K);E(7,10,4,2,B);R(4,9,4,1,L);R(5,11,4,1,D);R(9,9,1,3,D);
  R(11,9,3,3,K);R(12,10,2,1,B);R(11,9,1,1,Yw);R(12,11,2,2,K);R(13,7+o,3,2,K);R(13,12-o,3,2,K);R(14,8+o,1,1,B)
 }else if(d===0){
  R(6,1,4,7,K);R(7,2,2,5,B);R(7,4,2,1,K);R(7,6,2,1,K);R(7+t,0,2,2,K);R(7+t,1,1,1,Yw);
  for(let i=0;i<3;i++){const j=(i+f)&1;Y(1,8+i*2+j,3,1,K);Y(1,9+i*2+j,1,1,K)}
  R(5,6,6,1,K);R(4,7,8,5,K);R(5,12,6,1,K);R(5,7,6,5,B);R(5,7,6,1,L);R(6,10,4,1,D);R(7,8,2,2,D);Y(6,9,1,1,Yw);
  Y(3,11,2,2,K);if(o){Y(1,12,3,3,K);Y(2,13,1,1,B)}else{Y(0,12,2,4,K);Y(3,13,2,3,K)}
 }else{
  if(o){Y(1,2,3,4,K);Y(2,3,1,2,B)}else{Y(0,2,2,4,K);Y(3,3,2,3,K)}
  for(let i=0;i<3;i++){const j=(i+f)&1;Y(1,8+i*2+j,3,1,K);Y(1,9+i*2+j,1,1,K)}
  R(5,6,6,1,K);R(4,7,8,5,K);R(5,12,6,1,K);R(5,7,6,5,B);R(5,7,6,1,L);R(6,9,4,1,D);R(6,11,4,1,D);
  R(6,3,4,9,K);R(7,4,2,7,B);R(7,6,2,1,K);R(7,9,2,1,K);R(7+t,0,2,3,K);R(7+t,0,1,2,Yw)
 }};
NME.deserto.mum=(R,E,f,d)=>{const K='#43361f',A='#e8dcb8',B='#f6eed4',C='#b9a77c',Rd='#ff3b30';NMbrute(R,f,d,{K,A,B,C,dc:(R,Y,y,d,f,g)=>{
 if(d===0){R(3,y+7,10,1,C);R(3,y+9,10,1,C);R(5,y+2,6,2,K);Y(6,y+2,1,1,Rd);Y(5,y+4,3,1,C);R(1,y+12+g,1,2,C);R(14,y+12-g,1,2,B)}
 else if(d===1){R(4,y+6,2,1,C);R(6,y+7,2,1,C);R(8,y+8,2,1,C);R(10,y+9,2,1,C);R(5,y+2,6,1,C);R(5,y+4,6,1,C)}
 else{R(5,y+7,6,1,C);R(5,y+9,6,1,C);R(10,y+2,3,2,K);R(11,y+2,1,1,Rd);R(7,y+4,5,1,C);R(4,y+12+g,1,2,C)}}})};
NME.deserto.gol=(R,E,f,d)=>{const K='#3b2814',A='#b8863f',B='#d8aa5a',C='#8e6428',G='#7df9ff';NMbrute(R,f,d,{K,A,B,C,dc:(R,Y,y,d,f)=>{
 if(d===0){Y(5,y+2,2,1,G);R(6,y+3,4,1,K);R(7,y+6,2,4,C);R(7,y+7,2,1,f&1?'#ffffff':G);Y(4,y+10,3,1,B)}
 else if(d===1){R(6,y+6,1,3,C);R(9,y+8,1,3,C);R(7,y+9,2,1,K);R(5,y+1,1,2,C)}
 else{R(11,y+2,2,1,G);R(7,y+6,3,1,C);R(8,y+7,1,2,f&1?'#ffffff':G)}}})};

// ---------------------------------------------------------------- TUNDRA
NME.tundra.mor=(R,E,f,d)=>{const K='#10304f',B='#4aa3df',L='#bfeaff',C='#2f7fc0',F='#ff4d4d',Y=NSY(R,16),wy=[1,5,9,5][f],by=(f&1)?1:0;
 const wing=(Z,x0,sg,c1,c2)=>{for(let i=0;i<6;i++){const x=x0-i*sg,t=Math.round(7+by+(wy-7)*i/5),h=i<4?4:3;Z(x,t,1,h,K);Z(x,t+1,1,h-2,c1);if(i>0)Z(x,t,1,1,c2)}};
 if(d===2){
  [0].forEach(()=>{for(let i=0;i<6;i++){const x=7-i,t=Math.round(8+by+(wy-7)*i/5),h=i<4?4:3;R(x,t,1,h,K);R(x,t+1,1,h-2,C)}});
  R(6,5+by,4,7,K);R(7,6+by,2,5,B);R(7,6+by,2,1,L);R(7,12+by,1,2,K);
  R(9,3+by,5,4,K);R(10,4+by,3,2,B);R(10,1+by,2,3,K);R(12,4+by,1,1,F);R(13,6+by,1,1,'#ffffff');
  wing(R,8,1,B,L)
 }else{
  wing(Y,5,1,B,L);
  R(6,5+by,4,7,K);R(7,6+by,2,5,d?C:B);R(7,6+by,2,1,d?B:L);Y(6,12+by,1,2,K);
  Y(5,by,2,3,K);Y(6,by+1,1,1,B);R(5,2+by,6,4,K);R(6,3+by,4,2,d?C:B);
  if(!d){Y(6,3+by,1,1,F);Y(7,5+by,1,1,'#ffffff')}
 }};
NME.tundra.lob=(R,E,f,d)=>{NMdog(R,f,d,{K:'#2a3540',W:'#e6eef5',G:'#9fb2c4',Ey:'#ffd54f',dc:()=>{}})};
NME.tundra.yet=(R,E,f,d)=>{const K='#1d2c44',A='#f2f7fb',B='#ffffff',C='#b8cbe0',Bl='#6cc8f0',Rd='#ff4d4d';NMbrute(R,f,d,{K,A,B,C,dc:(R,Y,y,d,f,g)=>{
 if(d===0){R(6,y+2,4,3,Bl);Y(6,y+3,1,1,Rd);R(7,y+4,2,1,K);Y(4,y+8,2,1,C);Y(1,y+9+g,1,2,C)}
 else if(d===1){R(5,y+7,1,3,C);R(9,y+6,1,4,C);R(7,y+9,2,2,C);R(4,y+1,1,2,C)}
 else{R(10,y+2,3,3,Bl);R(11,y+3,1,1,Rd);R(12,y+4,1,1,K);R(6,y+8,3,1,C)}}})};

// ---------------------------------------------------------------- PANTANO
NME.pantano.sap=(R,E,f,d)=>{const K='#10241a',G='#4fae4a',L='#9be26a',Yw='#e8e24a',P='#a14ad9',Y=NSY(R,16),by=10+[0,-2,-3,-1][f]+(f===0?1:0),ry=f===0?3:4,ex=(f===1||f===2)?1:0;
 if(d===2){
  R(2,by+1,4,3,K);R(3,by+2,2,1,G);if(ex)R(0,by+3,3,1,K);
  E(7,by,6,ry,K);E(7,by,5,ry-1,G);R(5,by+ry-2,6,1,L);
  R(10,by-ry-1,3,3,K);R(11,by-ry,1,1,Yw);R(10,by,5,1,K);R(10,by+ry-1,2,2+ex,K);R(5,by-1,1,1,P);R(7,by,1,1,P)
 }else if(d===0){
  Y(1,by+1,3,3,K);Y(2,by+2,1,1,G);
  R(3,by-2,10,6,K);R(4,by-3,8,1,K);R(4,by-2,8,5,G);R(4,by-2,8,1,L);R(5,by+1,6,1,K);Y(5,by-1,1,1,P);
  Y(3,by-5,3,3,K);Y(4,by-4,1,1,Yw);Y(4,by+3,2,2+ex,K)
 }else{
  Y(2,by+2,4,3,K);Y(3,by+3,2,1,G);
  R(3,by-2,10,6,K);R(4,by-3,8,1,K);R(4,by-2,8,5,G);R(5,by-1,2,1,P);R(9,by,1,1,P);R(7,by+2,2,1,P);
  Y(3,by-5,3,2,K);Y(4,by-4,1,1,L)
 }};
NME.pantano.fat=(R,E,f,d)=>{const K='#0c2a2a',A='#3fe0c0',B='#b8fff0',C='#1a8f7f',b=[1,0,1,2][f],sw=[0,1,0,-1][f],T=d===2?-2:0,s2=sw>0?1:0;
 R(7+sw+T,b,2,2,K);R(6+s2+T,2+b,4,2,K);R(5,4+b,6,2,K);R(4,6+b,8,4,K);R(5,10+b,6,2,K);R(6,12+b,4,1,K);
 R(7+sw+T,1+b,1,1,B);R(7+s2+T,3+b,2,1,B);R(6,4+b,4,2,A);R(5,6+b,6,4,A);R(6,10+b,4,1,C);
 if(d===0){R(6,7+b,1,2,K);R(9,7+b,1,2,K);R(7,6+b,2,1,B)}
 else if(d===1){R(7,7+b,2,2,C);R(6,6+b,1,1,B);R(9,9+b,1,1,B)}
 else{R(9,7+b,1,2,K);R(6,7+b,3,1,C);R(7,5+b,2,1,B)}};
NME.pantano.tro=(R,E,f,d)=>{const K='#1a2a12',A='#6a8f3a',B='#98bf5a',C='#4a6a2a',M='#7fb04a',Yl='#ffe14d',T='#f4ecd6';NMbrute(R,f,d,{K,A,B,C,dc:(R,Y,y,d,f)=>{
 if(d===0){Y(6,y+2,1,1,Yl);R(6,y+4,4,1,K);Y(6,y+4,1,1,T);Y(3,y+1,1,2,K);R(3,y+5,4,1,M);R(9,y+6,3,1,M);R(10,y+7,1,1,B);R(5,y+8,6,2,C)}
 else if(d===1){Y(3,y+1,1,2,K);R(7,y+5,2,1,B);R(7,y+7,2,1,B);R(7,y+9,2,1,B);R(3,y+6,5,1,M);R(8,y+9,4,1,M)}
 else{R(11,y+2,1,1,Yl);R(11,y+4,3,1,K);R(12,y+4,1,1,T);R(6,y+1,1,2,K);R(5,y+6,4,1,M);R(6,y+8,1,1,B)}}})};

// ---------------------------------------------------------------- VULCAO
NME.vulcao.dia=(R,E,f,d)=>{const K='#2a0808',R1='#d83a1e',R2='#ff7a3a',Yw='#ffe14d',H='#e8e0d0',Y=NSY(R,16),wy=[0,1,2,1][f],ll=f===1?1:0,rl=f===3?1:0,t=[0,1,0,-1][f],sx=[-1,0,1,0][f];
 if(d===0){
  Y(1,6+wy,4,3,K);Y(2,7+wy,2,1,R2);Y(1,9+wy,2,1,K);
  Y(4,0,2,3,K);Y(4,0,1,2,H);R(4,3,8,5,K);R(5,4,6,3,R1);R(5,4,6,1,R2);Y(5,5,1,1,Yw);R(6,6,4,1,K);Y(6,7,1,1,H);
  R(5,8,6,4,K);R(6,8,4,3,R1);R(6,8,4,1,R2);R(11,11,3,1,K);R(13,10+t,2,2,K);
  R(5,12,2,3-ll,K);R(9,12,2,3-rl,K)
 }else if(d===1){
  Y(0,5+wy,5,4,K);Y(1,6+wy,3,1,R2);Y(0,9+wy,3,1,K);
  Y(4,0,2,3,K);Y(4,0,1,2,H);R(4,3,8,5,K);R(5,4,6,3,'#b82a14');R(5,4,6,1,R1);
  R(5,8,6,4,K);R(6,8,4,4,R1);R(7,8,2,1,R2);R(7+t,12,2,3,K);R(7+t,12,1,2,R2);
  R(4,12,2,3-ll,K);R(10,12,2,3-rl,K)
 }else{
  R(2,5+wy,5,4,K);R(3,6+wy,3,1,R2);R(1,9+wy,3,1,K);
  R(0,9+t,4,1,K);R(0,8+t,2,2,K);R(1,8+t,1,1,R2);
  R(5+sx,12,2,3-ll,K);R(7-sx,12,2,3-rl,K);
  R(4,8,6,4,K);R(5,8,4,3,R1);R(9,9,3,2,K);R(10,9,2,1,R2);
  R(8,0,2,3,K);R(8,0,1,2,H);R(6,1,1,2,K);R(6,3,7,5,K);R(7,4,5,3,R1);R(7,4,5,1,R2);R(10,5,1,1,Yw);R(10,6,3,1,K);R(12,7,1,1,H)
 }};
NME.vulcao.cao=(R,E,f,d)=>{const O='#d83a1e',Yw='#ffcf4a',tw=[0,-1,0,1][f];NMdog(R,f,d,{K:'#1a0606',W:'#6a1a12',G:'#3a0e0a',Ey:Yw,dc:(R,Y,f,d,bb)=>{
 if(d===2){[4,6,8].forEach((x,i)=>{const h=(f+i)&1;R(x,5+bb-h,2,2+h,O);R(x,5+bb-h,1,1,Yw)});R(0,5+bb+tw,1,1,Yw)}
 else if(d===0){Y(4,bb,2,1,O);R(7,10+bb,2,1,O);R(7,11+bb,2,1,Yw)}
 else{[5,9].forEach((x,i)=>{const h=(f+i)&1;R(x,8+bb-h,2,2+h,O)});R(7+tw,9+bb,2,1,Yw);R(7+tw,10+bb,1,2,O)}}})};
NME.vulcao.gol=(R,E,f,d)=>{const K='#140a0a',A='#3a2a2e',B='#5a444a',C='#241818',O='#ff6a1e',Yl='#ffcf4a',H=f&1?Yl:O;NMbrute(R,f,d,{K,A,B,C,dc:(R,Y,y,d,f,g)=>{
 if(d===0){Y(6,y+2,1,1,Yl);R(6,y+3,4,1,O);R(5,y+6,1,4,H);R(6,y+8,3,1,H);R(10,y+7,1,3,O);R(8,y+6,1,1,Yl);R(0,y+11+g,1,1,O);R(15,y+11-g,1,1,O)}
 else if(d===1){R(7,y+6,1,5,H);R(5,y+8,2,1,O);R(9,y+9,2,1,O);R(10,y+6,1,1,Yl)}
 else{R(11,y+2,1,1,Yl);R(10,y+3,3,1,O);R(6,y+7,3,1,H);R(7,y+8,1,2,O)}}})};

// ---------------------------------------------------------------- ABISMO
NME.abismo.olh=(R,E,f,d)=>{const K='#12082a',W='#f4f0ff',I='#a64aff',Pp='#05030c',Rd='#ff4d6a',Y=NSY(R,16),by=[1,0,1,2][f],j=[0,1,0,-1][f];
 if(d===0){Y(1,6+by,2,3,K);E(8,8+by,6,5,K);E(8,8+by,5,4,W);E(8+j,8+by,3,3,I);R(7+j,7+by,2,2,Pp);R(6,6+by,1,1,'#ffffff');R(4,6+by,1,1,Rd);R(11,9+by,1,1,Rd)}
 else if(d===1){Y(1,6+by,2,3,K);E(8,8+by,6,5,K);E(8,8+by,5,4,'#c9b8f0');R(5,6+by,1,3,Rd);R(10,7+by,1,3,Rd);R(7,11+by,3,1,Rd);E(8,8+by,2,2,'#7a3ad0');R(7,7+by,2,1,'#e0a8ff')}
 else{E(8,8+by,6,5,K);E(8,8+by,5,4,W);E(11,8+by,2,3,I);R(12,7+by,1,2,Pp);R(10,6+by,1,1,'#ffffff');R(5,6+by,1,2,Rd);R(0,9+by+j,3,2,K);R(1,9+by+j,2,1,'#7a3ad0');R(1,11+by+j,1,2,K)}};
NME.abismo.med=(R,E,f,d)=>{const K='#1a0a3a',A='#c06aff',B='#f0c8ff',C='#7a3ad0',bw=[6,5,4,5][f],bh=[5,6,7,6][f],cy=[6,6,5,6][f];
 for(let i=0;i<4;i++){
  for(let j=0;j<4;j++){const x=(d===2?5+i*2-(((j+f+i)&2)?1:0):4+i*3+(((i+f)&1)?(j>1?1:0):0));R(x,11+j,1,1,j<3?A:K)}}
 E(8,cy,bw,bh,K);E(8,cy,bw-1,bh-1,A);R(5,cy-3,4,2,B);R(8,cy+1,3,1,C);
 if(d===0){R(6,cy,1,2,K);R(9,cy,1,2,K)}
 else if(d===1){R(6,cy-1,1,1,B);R(10,cy+1,1,1,B);R(8,cy+2,1,1,C)}
 else{R(11,cy,1,2,K);R(12,cy+1,1,1,B)}};
NME.abismo.sen=(R,E,f,d)=>{const K='#0a0820',A='#4a4aa0',B='#7a7ae0',C='#2a2a70',G='#52f0ff',H=f&1?'#ffffff':G;NMbrute(R,f,d,{K,A,B,C,dc:(R,Y,y,d,f)=>{
 if(d===0){R(5,y+2,6,1,G);R(7,y+7,2,3,H);Y(3,y+9,3,1,C)}
 else if(d===1){R(5,y+2,6,1,C);R(7,y+6,1,4,G);R(8,y+7,1,2,G);Y(4,y+9,2,1,C)}
 else{R(9,y+2,4,1,G);R(6,y+7,3,3,C);R(7,y+8,1,1,H)}}})};

// ---------------------------------------------------------------- BOSSES (32x32)
NME.deserto.far=(R,E,f,d)=>{const K='#1a1230',Yg='#f6c945',Y2='#ffe58a',Y3='#c08a1e',Bl='#2a4db5',Bl2='#5f86ee',Gr='#6bdc6b',Cy='#7df9ff',by=[0,1,0,1][f],g=[1,0,-1,0][f];
 if(d===0){
  R(5,3+by,22,22,K);R(6,4+by,20,20,Bl);R(6,4+by,3,20,Bl2);for(let y=6;y<24;y+=4){R(6,y+by,5,2,Yg);R(21,y+by,5,2,Yg)}
  R(8,24,16,7,K);R(9,25,14,5,Bl);R(9,25,14,2,Yg);R(12,27,8,3,Y3);R(15,27,2,3,Y2);
  R(11,5+by,10,13,K);R(12,6+by,8,11,Yg);R(12,6+by,8,2,Y2);R(13,9+by,2,2,K);R(17,9+by,2,2,K);R(14,9+by,1,1,Cy);R(18,9+by,1,1,Cy);R(15,12+by,2,2,Y3);R(14,15+by,4,1,K);R(15,17+by,2,4,K);R(15,17+by,2,3,Y3);
  R(15,by,2,5,K);R(14,2+by,4,2,'#3fae4a');R(15,by,2,3,Gr);
  R(3,26-g,5,5,K);R(4,27-g,3,3,Y3);R(24,25+g,5,6,K);R(25,26+g,3,4,Y3);R(27,18+g,2,12,K);R(27,19+g,1,10,Yg)
 }else if(d===1){
  R(5,3+by,22,22,K);R(6,4+by,20,20,Bl);R(6,4+by,3,20,Bl2);for(let y=6;y<24;y+=4){R(6,y+by,5,2,Yg);R(21,y+by,5,2,Yg)}
  R(11,5+by,10,13,K);R(12,6+by,8,11,'#1f3a8a');R(14,4+by,4,21,Yg);R(14,4+by,1,21,Y2);R(13,22+by,6,4,K);R(14,23+by,4,3,Y3);
  R(8,24,16,7,K);R(9,25,14,5,Bl);R(15,25,2,5,Yg);R(9,26,14,1,Yg);
  R(15,by,2,4,K);R(15,by,2,2,Gr);
  R(3,26-g,5,5,K);R(4,27-g,3,3,Y3);R(24,25+g,5,6,K);R(25,26+g,3,4,Y3);R(27,18+g,2,12,K);R(27,19+g,1,10,Yg)
 }else{
  R(4,10+by,6,15,K);R(5,11+by,4,13,Bl);for(let y=12;y<24;y+=4)R(5,y+by,3,2,Yg);
  R(8,3+by,16,22,K);R(9,4+by,14,20,Bl);R(9,4+by,3,20,Bl2);for(let y=6;y<24;y+=4)R(9,y+by,6,2,Yg);
  R(9,24,14,7,K);R(10,25,12,5,Bl);R(10,25,12,2,Yg);R(13,27,6,3,Y3);
  R(18,6+by,6,12,K);R(19,7+by,4,10,Yg);R(19,7+by,4,2,Y2);R(20,9+by,2,2,K);R(21,9+by,1,1,Cy);R(23,11+by,2,3,K);R(23,12+by,1,1,Y3);R(21,18+by,2,3,Y3);
  R(13,by,2,4,K);R(13,by,2,2,Gr);R(14,2+by,5,2,'#3fae4a');
  R(25,18+g,2,12,K);R(25,19+g,1,10,Yg);R(23,25-g,5,5,K);R(24,26-g,3,3,Y3)
 }};
NME.tundra.rei=(R,E,f,d)=>{const K='#10264a',A='#5fb4e6',B='#b8eaff',C='#3a7fc0',Rd='#ff4d4d',by=[0,1,0,1][f],g=[1,0,-1,0][f],ll=f===1?1:0,rl=f===3?1:0;
 if(d!==2){
  R(7,27,7,4-ll,K);R(18,27,7,4-rl,K);R(8,27,5,2,A);R(19,27,5,2,A);
  R(0,15+by+g,5,13,K);R(1,16+by+g,3,11,C);R(27,15+by-g,5,13,K);R(28,16+by-g,3,11,C);
  R(4,14+by,24,14,K);R(5,15+by,22,12,d?C:A);R(5,15+by,22,2,d?A:B);
  if(!d){R(8,18+by,6,6,C);R(18,18+by,6,6,C);R(15,17+by,2,9,B)}else{R(9,18+by,1,8,A);R(22,18+by,1,8,A);R(15,17+by,2,9,A)}
  R(8,5+by,16,10,K);R(9,6+by,14,8,d?C:A);R(9,6+by,14,2,d?A:B);
  if(!d){R(12,9+by,2,2,Rd);R(18,9+by,2,2,Rd);R(13,12+by,6,1,K);R(13,14+by,6,2,B);R(15,16+by,2,2,B)}
 }else{
  R(9+g*3,27,7,4-ll,K);R(16-g*3,27,7,4-rl,K);
  R(8,14+by,16,14,K);R(9,15+by,14,12,A);R(9,15+by,14,2,B);R(10,18+by,6,6,C);
  R(14,15+by+g,6,13,K);R(15,16+by+g,4,11,C);
  R(10,5+by,14,10,K);R(11,6+by,12,8,A);R(11,6+by,12,2,B);R(19,9+by,2,2,Rd);R(19,12+by,4,1,K);R(18,14+by,5,3,B)
 }
 R(d===2?11:9,by,3,6,K);R(d===2?12:10,1+by,1,5,B);R(d===2?16:15,by,3,6,K);R(d===2?17:16,1+by,1,5,B);R(21,by,3,6,K);R(22,1+by,1,5,B)};
NME.pantano.bru=(R,E,f,d)=>{const K='#1a0f2a',P='#6a3fa8',P2='#9b6ae0',G='#7fbf4a',G2='#b4e87a',Yw='#ffe14d',St='#3a2a1a',by=[0,1,0,1][f],ll=f===1?1:0,rl=f===3?1:0,Or=f&1?'#d8ffe0':'#7dff9a',Hr='#2a1a3a';
 if(d!==2){
  R(1,14-by,2,16,St);R(0,11-by,4,4,K);R(1,12-by,2,2,Or);
  R(5,19,22,11,K);R(6,19,20,10,P);R(6,19,4,10,P2);R(22,22,4,7,'#4a2a7a');
  if(!d){R(13,19,6,2,Yw);R(15,21,2,2,Yw)}else{R(15,19,2,10,P2)}
  R(8,30,5,2-ll,K);R(19,30,5,2-rl,K);R(3,22,4,3,K);R(4,23,2,1,G);
  R(10,10+by,12,9,K);R(11,11+by,10,7,d?Hr:G);
  if(!d){R(11,11+by,10,1,G2);R(13,13+by,2,2,Yw);R(17,13+by,2,2,Yw);R(14,13+by,1,1,K);R(18,13+by,1,1,K);R(15,15+by,2,3,K);R(13,17+by,6,1,K);R(12,12+by,1,1,'#4a8a2a')}
  else{R(13,11+by,1,7,'#4a2a6a');R(18,11+by,1,7,'#4a2a6a');R(10,17+by,12,3,K)}
  R(15,by,3,2,K);R(12,2+by,8,3,K);R(13,3+by,6,2,P);R(10,5+by,12,2,K);R(14,6+by,5,1,Yw);R(4,7+by,24,3,K);R(5,8+by,22,1,P);R(5,7+by,22,1,P2)
 }else{
  R(26,13-by,2,17,St);R(25,10-by,4,4,K);R(26,11-by,2,2,Or);
  R(8,19,16,11,K);R(9,19,14,10,P);R(9,19,3,10,P2);R(18,22,5,7,'#4a2a7a');R(10,30,5,2-ll,K);R(17,30,5,2-rl,K);
  R(23,22,4,3,K);R(24,23,2,1,G);
  R(10,11+by,4,9,Hr);R(13,10+by,10,9,K);R(14,11+by,8,7,G);R(14,11+by,8,1,G2);R(22,14+by,3,3,K);R(22,14+by,2,2,G);R(19,13+by,2,2,Yw);R(20,13+by,1,1,K);R(16,17+by,5,1,K);R(15,12+by,1,1,'#4a8a2a');
  R(10,1+by,3,2,K);R(11,3+by,8,3,K);R(12,4+by,6,2,P);R(8,6+by,18,2,K);R(12,7+by,6,1,Yw);R(5,7+by,22,3,K);R(6,8+by,20,1,P);R(6,7+by,20,1,P2)
 }};
NME.vulcao.dem=(R,E,f,d)=>{const K='#1a0408',Rr='#c4301c',R2='#ff6a3a',D='#7a1810',Yw='#ffe14d',H='#efe6d4',Y=NSY(R,32),w=[0,1,2,1][f],g=[1,0,-1,0][f],ll=f===1?1:0,rl=f===3?1:0,t=[0,1,0,-1][f],sx=[-1,0,1,0][f];
 if(d===0){
  Y(0,12+w,8,12,K);Y(1,13+w,6,10,D);Y(3,14+w,1,8,K);
  Y(7,2,4,8,K);Y(8,3,2,6,H);Y(6,0,3,4,K);Y(7,1,1,2,H);
  Y(5,17+g,4,9,K);Y(6,18+g,2,7,Rr);Y(6,25+g,2,1,Yw);
  R(10,6,12,10,K);R(11,7,10,8,Rr);R(11,7,10,2,R2);R(12,10,3,2,Yw);R(17,10,3,2,Yw);R(13,10,1,1,K);R(18,10,1,1,K);R(13,14,6,1,K);R(14,15,1,2,H);R(17,15,1,2,H);
  R(8,16,16,13,K);R(9,16,14,12,Rr);R(9,16,14,2,R2);R(12,19,8,6,D);R(14,20,4,3,R2);R(15,21,2,1,Yw);
  R(10,29,5,3-ll,K);R(17,29,5,3-rl,K);R(15+t,29,2,3,K)
 }else if(d===1){
  Y(0,8+w,9,16,K);Y(1,9+w,7,14,D);Y(4,10+w,1,12,K);Y(1,9+w,1,14,R2);
  Y(7,2,4,8,K);Y(8,3,2,6,H);Y(6,0,3,4,K);Y(7,1,1,2,H);
  R(10,6,12,10,K);R(11,7,10,8,'#9a2012');R(11,7,10,2,Rr);
  R(8,16,16,13,K);R(9,16,14,12,Rr);R(15,16,2,12,D);R(12,18,1,8,D);R(19,18,1,8,D);
  Y(5,17+g,4,9,K);Y(6,18+g,2,7,Rr);
  R(10,29,5,3-ll,K);R(17,29,5,3-rl,K);R(15+t,28,2,4,K);R(15+t,28,1,3,R2)
 }else{
  R(4,8+w,10,16,K);R(5,9+w,8,14,D);R(7,10+w,1,12,K);R(5,9+w,1,14,R2);
  R(4,26+t,7,2,K);R(2,24+t,3,4,K);R(2,24+t,1,2,R2);
  R(12+sx*3,29,5,3-ll,K);R(17-sx*3,29,5,3-rl,K);
  R(10,16,12,13,K);R(11,16,10,12,Rr);R(11,16,10,2,R2);R(12,19,6,6,D);
  R(18,18+g,5,9,K);R(19,19+g,3,7,Rr);R(19,26+g,3,1,Yw);
  R(14,2,4,8,K);R(15,3,2,6,H);R(11,3,3,5,K);
  R(12,6,12,10,K);R(13,7,10,8,Rr);R(13,7,10,2,R2);R(19,10,3,2,Yw);R(20,10,1,1,K);R(22,12,3,3,K);R(21,14,1,2,H);R(15,14,6,1,K)
 }};
NME.abismo.dev=(R,E,f,d)=>{const K='#0a0420',W='#f4f0ff',I='#a64aff',I2='#e0a8ff',P='#05030c',T='#4a1a9a',T2='#7a3ad8',Rd='#ff4d6a',y=[1,0,1,2][f],sw=[0,1,0,-1][f],pr=f&1?2:3;
 for(let i=0;i<6;i++){const x=(d===2?4+i*4:2+i*5),s=((i+f)&1)+sw*(i&1);R(x+s,25,3,4,K);R(x+s+1,25,1,4,i%2?T:T2);R(x+s-(d===2?1:0),29,3,3,K);R(x+s-(d===2?1:0)+1,29,1,2,i%2?T:T2)}
 R(3,2+y,3,5,K);R(4,3+y,1,3,T2);R(26,2+y,3,5,K);R(27,3+y,1,3,T2);R(15,y,2,3,K);R(15,1+y,2,1,T2);
 if(d===0){
  E(16,13+y,13,11,K);E(16,13+y,12,10,W);E(16,13+y,6,7,I);E(16,13+y,4,5,I2);E(16,13+y,pr,4,P);R(14,10+y,2,2,'#ffffff');
  R(6,10+y,3,1,Rd);R(9,11+y,2,1,Rd);R(22,16+y,4,1,Rd);R(24,12+y,2,1,Rd);R(10,19+y,1,3,Rd)
 }else if(d===1){
  E(16,13+y,13,11,K);E(16,13+y,12,10,'#c9b8f0');E(16,13+y,5,6,'#7a3ad0');E(16,13+y,3,4,I);R(15,12+y,2,2,I2);
  R(6,9+y,1,5,Rd);R(8,14+y,3,1,Rd);R(24,8+y,1,6,Rd);R(21,15+y,4,1,Rd);R(11,20+y,1,3,Rd);R(21,19+y,1,3,Rd)
 }else{
  E(15,13+y,12,11,K);E(15,13+y,11,10,W);E(21,13+y,5,8,I);E(22,13+y,3,6,I2);R(23,11+y,2,5,P);R(21,9+y,2,2,'#ffffff');
  R(7,9+y,3,1,Rd);R(9,10+y,2,1,Rd);R(8,18+y,1,3,Rd);R(13,21+y,3,1,Rd)
 }};


// ---------------------------------------------------------------- AMPLIACAO 16-BIT
// Cada pintor acima desenha na grade base (16 ou 32). NMup pinta nessa grade, amplia k vezes (Scale2x/Scale3x: diagonais suaves, sem borrar),
// afina o contorno externo para 1px, e aplica luz (cima/esquerda) e sombra (baixo/direita) nas bordas. Tudo em cores solidas.
function NMscale(g,S,k){const N=S*k,o=Array.from({length:N},()=>Array(N).fill(null)),G=(x,y)=>x<0||y<0||x>=S||y>=S?null:g[y][x];
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const E=G(x,y),B=G(x,y-1),D=G(x-1,y),F=G(x+1,y),H=G(x,y+1);let t;
  if(k===2){t=[E,E,E,E];
   if(D===B&&D!==H&&B!==F)t[0]=B;if(B===F&&B!==D&&F!==H)t[1]=F;if(H===D&&H!==F&&D!==B)t[2]=D;if(F===H&&F!==B&&H!==D)t[3]=H}
  else{const A=G(x-1,y-1),C=G(x+1,y-1),Gg=G(x-1,y+1),I=G(x+1,y+1);
   t=[D===B&&B!==F&&D!==H?D:E,(D===B&&B!==F&&D!==H&&E!==C)||(B===F&&B!==D&&F!==H&&E!==A)?B:E,B===F&&B!==D&&F!==H?F:E,
      (D===B&&B!==F&&D!==H&&E!==Gg)||(D===H&&D!==B&&H!==F&&E!==A)?D:E,E,(B===F&&B!==D&&F!==H&&E!==I)||(F===H&&F!==B&&H!==D&&E!==C)?F:E,
      D===H&&D!==B&&H!==F?D:E,(D===H&&D!==B&&H!==F&&E!==I)||(F===H&&F!==B&&H!==D&&E!==Gg)?H:E,F===H&&F!==B&&H!==D?F:E]}
  for(let j=0;j<k;j++)for(let i=0;i<k;i++)o[y*k+j][x*k+i]=t[j*k+i]}
 return o}
const NMmix=(c,t,a)=>{const n=[1,3,5].map(i=>Math.round(parseInt(c.substr(i,2),16)*(1-a)+t*a));return'#'+n.map(v=>v.toString(16).padStart(2,'0')).join('')};
function NMrefine(o,N,k){
 const lum=c=>parseInt(c.substr(1,2),16)*.3+parseInt(c.substr(3,2),16)*.59+parseInt(c.substr(5,2),16)*.11;let K=null,lm=1e9;
 for(const r of o)for(const c of r)if(c&&lum(c)<lm){lm=lum(c);K=c}
 const dist=Array.from({length:N},()=>Array(N).fill(99)),q=[];
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!o[y][x]){dist[y][x]=0;q.push([x,y])}
 for(let h=0;h<q.length;h++){const[x,y]=q[h],d=dist[y][x];if(d>k)continue;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<N&&b<N&&dist[b][a]>d+1){dist[b][a]=d+1;q.push([a,b])}}}
 const cp=o.map(r=>r.slice());
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=cp[y][x];if(c!==K||dist[y][x]<2||dist[y][x]>k)continue;
  for(const[dx,dy]of[[0,1],[1,0],[-1,0],[0,-1]]){const n=cp[y+dy]&&cp[y+dy][x+dx];if(n&&n!==K){o[y][x]=n;break}}}
 const c2=o.map(r=>r.slice()),g=(x,y)=>x<0||y<0||x>=N||y>=N?null:c2[y][x],e=(c)=>c===null||c===K;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=c2[y][x];if(!c||c===K)continue;
  if(e(g(x,y-1))||e(g(x-1,y)))o[y][x]=NMmix(c,255,.2);else if(e(g(x,y+1))||e(g(x+1,y)))o[y][x]=NMmix(c,0,.25)}}
function NMup(p,S,k){return(R,E,f,d)=>{
 const g=Array.from({length:S},()=>Array(S).fill(null)),
  Rg=(x,y,w,h,c)=>{for(let j=Math.max(0,y);j<Math.min(S,y+h);j++)for(let i=Math.max(0,x);i<Math.min(S,x+w);i++)g[j][i]=c},
  Eg=(X,Y,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const q=Math.round(rx*Math.sqrt(Math.max(0,1-j*j/((ry*ry)||1))));Rg(X-q,Y+j,2*q+1,1,c)}};
 p(Rg,Eg,f,d);const o=NMscale(g,S,k),N=S*k;NMrefine(o,N,k);
 for(let y=0;y<N;y++){let x=0;while(x<N){const c=o[y][x];let w=1;while(x+w<N&&o[y][x+w]===c)w++;if(c)R(x,y,w,1,c);x+=w}}}}

// registro: troca o pintor de cada inimigo/boss de NM (4 quadros x 3 vistas, ampliado k vezes; d.K = fator, d.D = vistas). nmSpr desenha com escala 1
try{for(const m in NME){const M=typeof NM!=='undefined'&&NM[m];if(!M)continue;for(const e of M.en.concat([M.bs])){const p=NME[m][e.k];if(p){const k=e===M.bs?3:Math.max(2,Math.round(e.r*2.8/e.S));e.p=NMup(p,e.S,k);e.D=1;e.K=k;e.S*=k}}}}catch(err){console.warn('enemies.js: falha ao registrar sprites',err)}
