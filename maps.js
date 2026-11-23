// Mapas tematicos (dados estaticos + pintores procedurais em pixel art, sem imagens externas).
// Carregado depois de data.js e antes de game.js. Cada mapa: pal (cores), g (geracao), os (obstaculos), dc (decoracao), en (3 inimigos), bs (boss), am (particulas de ambiente).
// Pintores: R(x,y,w,h,cor) = retangulo; E(cx,cy,rx,ry,cor) = elipse solida; f = quadro de animacao (0/1). Tudo em cores 100% solidas.
const NMc=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 const R=(x,y,a,b,k)=>{g.fillStyle=k;g.fillRect(x,y,a,b)},E=(X,Y,rx,ry,k)=>{g.fillStyle=k;for(let j=-ry;j<=ry;j++){const q=Math.round(rx*Math.sqrt(Math.max(0,1-j*j/((ry*ry)||1))));g.fillRect(X-q,Y+j,2*q+1,1)}};fn(R,E);return c};
function NM_ob(M,i){const c=M._ob||(M._ob=[]);if(c[i])return c[i];const d=M.os[i];let cv;try{cv=NMc(d.w,d.h,d.p)}catch(e){cv=NMc(d.w,d.h,R=>R(0,0,d.w,d.h,'#ff00ff'))}return c[i]={cv,ax:d.ax,ay:d.ay,cr:d.cr,co:d.co,mc:d.mc}}
function NM_dc(M,i){const c=M._dc||(M._dc=[]);if(c[i])return c[i];let cv;try{cv=NMc(8,5,M.dc[i])}catch(e){cv=NMc(8,5,R=>{})}return c[i]=cv}
let NM_ck=null;
function NM_spr(d,f,tint){try{const c=d._c||(d._c=[]);if(!c[f])c[f]=NMc(d.S,d.S,(R,E)=>d.D?d.p(R,E,f&3,f>>2):d.p(R,E,f));if(!tint)return c[f];
 const t=d._t||(d._t={}),k=tint+f;if(!t[k]){const s=document.createElement('canvas');s.width=s.height=d.S;const g=s.getContext('2d');g.drawImage(c[f],0,0);g.globalCompositeOperation='source-in';g.fillStyle=tint;g.fillRect(0,0,d.S,d.S);
  if(tint!=='#fff'){if(!NM_ck){const q=document.createElement('canvas');q.width=q.height=2;const h=q.getContext('2d');h.fillRect(0,0,1,1);h.fillRect(1,1,1,1);NM_ck=q}g.globalCompositeOperation='destination-in';g.fillStyle=g.createPattern(NM_ck,'repeat');g.fillRect(0,0,d.S,d.S)}
  const o=document.createElement('canvas');o.width=o.height=d.S;const h2=o.getContext('2d');h2.drawImage(c[f],0,0);h2.drawImage(s,0,0);t[k]=o}return t[k]}catch(e){return null}}

const NM={
// ---------------------------------------------------------------- DESERTO
deserto:{name:'Deserto Escaldante',desc:'Dunas, cactos e oásis. Escorpiões, múmias e o Faraó Eterno.',
 pal:{a:'#e3c27a',b:'#d9b569',c:'#c79f55',d:'#f0d896',w:'#2fa3a8',we:'#a8ece0',wd:'#1f7f86',ws:'#e8fffa'},
 g:{mode:'oasis',sc:9,th:.7,md:7,pt:.05,p0:.006,pr:.014,o1:[0,0,1],o2:[2,3],ro:[1]},
 hz:{c:'#c9a14f',e:'#8f6a2c',s:'#f0d896',d:'#a47e38'},fx:{sp:.55},tip:'Areia movediça! Ela deixa você bem mais lento.',
 am:{n:44,c:['#f6e2a0','#ffffff','#e8c46a'],vx:70,vy:8,s:2},
 os:[
  {w:14,h:26,ax:7,ay:25,cr:8,co:5,mc:'#2f7d3a',p:R=>{const K='#12361c',G='#3f9a47',L='#86d977',D='#2b7034';
   R(4,1,6,24,K);R(5,0,4,1,K);R(5,1,4,23,G);R(5,1,1,23,L);R(8,2,1,22,D);
   R(0,9,5,3,K);R(0,5,3,5,K);R(1,6,1,4,G);R(1,10,4,1,G);R(1,6,1,1,L);
   R(9,13,5,3,K);R(11,9,3,5,K);R(12,10,1,4,G);R(9,14,4,1,G);R(12,10,1,1,L);
   R(6,6,1,1,'#fff6c0');R(7,12,1,1,'#fff6c0');R(6,18,1,1,'#fff6c0');R(8,21,1,1,'#fff6c0')}},
  {w:26,h:34,ax:13,ay:33,cr:6,co:4,mc:'#3b8c3a',p:R=>{const K='#3a2410',T='#8a5a2b',T2='#b07a3c',G='#2f8f3a',G2='#5fc55a',D='#1d5a28';
   for(let i=0;i<26;i++){const x=12+Math.round(Math.sin(i*.25)*1.5);R(x,8+i,3,1,K);R(x+1,8+i,1,1,i%3?T:T2)}
   R(4,6,8,2,D);R(1,8,6,2,D);R(0,10,3,2,D);R(14,6,8,2,D);R(19,8,6,2,D);R(23,10,3,2,D);R(8,3,10,3,D);R(10,0,6,3,D);
   R(5,6,7,1,G);R(2,8,5,1,G);R(15,6,7,1,G);R(19,8,5,1,G);R(9,3,8,2,G2);R(11,1,4,1,G2);R(11,9,2,2,'#7a4a1c');R(14,9,2,2,'#7a4a1c')}},
  {w:22,h:16,ax:11,ay:15,cr:12,co:6,mc:'#a0845a',p:(R,E)=>{E(11,10,10,5,'#4a3520');E(11,9,9,5,'#b99a68');E(9,8,6,3,'#d4b985');R(5,12,12,1,'#8a6d44');R(14,6,3,2,'#e8d3a0')}},
  {w:14,h:24,ax:7,ay:23,cr:8,co:6,mc:'#9a8660',p:R=>{const K='#3d3022',A='#c9b68a',B='#a39068',C='#e6d7ad';
   R(2,22,10,2,K);R(3,8,8,14,K);R(4,9,6,13,A);R(4,9,2,13,C);R(8,9,2,13,B);R(2,6,10,3,K);R(3,6,8,2,A);R(5,3,5,3,K);R(6,4,3,1,B);for(let y=12;y<21;y+=4)R(4,y,6,1,B)}}],
 dc:[R=>{R(1,3,2,2,'#a98652');R(4,2,3,2,'#c4a06a');R(2,3,1,1,'#e0c590')},
     R=>{R(1,1,1,4,'#8a7a2e');R(3,0,1,5,'#a89a3e');R(5,2,1,3,'#8a7a2e')},
     R=>{R(0,2,2,2,'#f1ead6');R(2,3,4,1,'#f1ead6');R(6,2,2,2,'#f1ead6');R(0,4,1,1,'#bdb59a')}],
 en:[
  {k:'esc',n:'Escorpião',r:10,h:1.3,s:1.1,d:1,S:16,p:(R,E,f)=>{const K='#3a1a10',B='#c2552b',L='#f08a4a';
   for(let i=0;i<4;i++)R(3+i*2,12+((i+f)%2),1,2,K);
   E(7,10,5,3,K);E(7,10,4,2,B);R(4,9,4,1,L);
   R(11,9,3,3,K);R(12,10,2,1,B);R(13,8,2,2,K);R(13,12,2,2,K);R(14,13,1,1,B);
   R(1,9,2,2,K);R(0,6,3,4,K);R(1,3,4,4,K);R(4,2,3,2,K);R(1,7,1,2,B);R(2,4,2,2,B);R(6,3,1,2,'#ffe14d');R(10,9,1,1,'#fff')}},
  {k:'mum',n:'Múmia',r:12,h:2.6,s:.9,d:1.1,S:16,p:(R,E,f)=>{const K='#43361f',W='#e8dcb8',S='#b9a77c';
   R(5,1,6,6,K);R(6,2,4,4,W);R(6,3,4,1,S);R(7,2,1,1,'#ff3b30');R(9,2,1,1,'#ff3b30');R(6,5,4,1,S);
   R(4,7,8,6,K);R(5,7,6,5,W);R(5,9,6,1,S);R(5,11,6,1,S);R(6,8,4,1,S);
   R(2,7+f,2,5,K);R(3,7+f,1,5,W);R(12,8-f,2,5,K);R(12,8-f,1,5,W);
   R(5,13,3,2+f,K);R(6,13,1,1+f,W);R(8,13,3,3-f,K);R(9,13,1,2-f,W);R(10,10,2,3,S)}},
  {k:'gol',n:'Golem de Arenito',r:17,h:8,s:.7,d:1.7,S:16,p:(R,E,f)=>{const K='#3b2814',A='#b8863f',B='#d8aa5a',C='#8e6428';
   R(4,0,8,5,K);R(5,1,6,3,A);R(5,1,6,1,B);R(6,2,1,1,'#7df9ff');R(9,2,1,1,'#7df9ff');
   R(2,5,12,7,K);R(3,5,10,6,A);R(3,5,10,1,B);R(3,8,10,1,C);R(7,6,2,4,C);R(4,10,3,1,B);
   R(0,6,3,8,K);R(1,6,1,7,B);R(1,12,2,1,C);R(13,6,3,8,K);R(14,6,1,7,C);
   R(3,12,4,3-f,K);R(4,12,2,2-f,A);R(9,12,4,2+f,K);R(10,12,2,1+f,A)}}],
 bs:{k:'far',n:'Faraó Eterno',S:32,p:(R,E,f)=>{const K='#1a1230',Y='#f6c945',Y2='#ffe58a',Y3='#c08a1e',Bl='#2a4db5',Bl2='#5f86ee';
   R(5,3,22,22,K);R(6,4,20,20,Bl);R(6,4,3,20,Bl2);for(let y=6;y<24;y+=4){R(6,y,5,2,Y);R(21,y,5,2,Y)}
   R(11,5,10,13,K);R(12,6,8,11,Y);R(12,6,8,2,Y2);R(13,9,2,2,K);R(17,9,2,2,K);R(14,9,1,1,'#7df9ff');R(18,9,1,1,'#7df9ff');R(14,14,4,1,K);R(15,15,2,2,Y3);
   R(15,0,2,5,K);R(14,2,4,2,'#3fae4a');R(15,0,2,3,'#6bdc6b');
   R(8,25,16,6,K);R(9,25,14,5,Bl);R(9,26,14,1,Y);R(13,27,6,3,Y);
   R(3,26-f,5,5,K);R(4,27-f,3,3,Y3);R(24,25+f,5,6,K);R(25,26+f,3,4,Y3);R(27,18+f,2,12,K);R(27,19+f,1,10,Y)}}},

// ---------------------------------------------------------------- TUNDRA
tundra:{name:'Tundra Gélida',desc:'Neve, abetos e lagos congelados. Morcegos, lobos e yetis.',
 pal:{a:'#eaf3fb',b:'#dce9f5',c:'#c3d6ea',d:'#ffffff',w:'#8fd0f0',we:'#e8fbff',wd:'#5aa8d6',ws:'#ffffff'},
 g:{mode:'rio',sc:18,rw:.1,th:.72,md:7,pt:.1,p0:.007,pr:.014,o1:[0,0,0,1],o2:[2,3]},
 hz:{c:'#bfe6fb',e:'#8fc4e8',s:'#ffffff',d:'#9cd0ee'},fx:{sp:1.35},tip:'Gelo liso! Você corre mais rápido sobre ele. Rios fundos bloqueiam.',
 am:{n:56,c:['#ffffff','#dff3ff'],vx:-14,vy:46,s:2},
 os:[
  {w:22,h:34,ax:11,ay:33,cr:7,co:4,mc:'#2f6b57',p:R=>{const K='#0f2a28',G='#2b7a5a',G2='#3f9c72',S='#ffffff',S2='#cfe6f5',T='#5a3a22';
   R(10,28,3,5,K);R(11,28,1,5,T);
   for(let i=0;i<5;i++){const y=1+i*6,w=4+i*4,x=11-w/2;R(x-1,y,w+2,7,K);R(x,y+1,w,5,G);R(x+w-3,y+3,2,2,G2);R(x+1,y+1,w-2,1,S);R(x+3,y+2,Math.max(1,w-6),1,S2)}}},
  {w:20,h:30,ax:10,ay:29,cr:7,co:5,mc:'#6a4a38',p:R=>{const K='#2a1d18',T='#6a4a38',S='#ffffff';
   R(8,10,4,19,K);R(9,10,2,19,T);R(3,12,6,2,K);R(1,9,3,4,K);R(11,8,7,2,K);R(16,5,3,5,K);R(5,6,3,2,K);R(4,4,2,3,K);R(8,4,4,7,K);R(9,5,2,5,T);
   R(0,8,5,1,S);R(15,4,5,1,S);R(7,3,6,1,S);R(2,11,6,1,S);R(7,28,6,1,S)}},
  {w:22,h:16,ax:11,ay:15,cr:12,co:6,mc:'#8fc4e8',p:(R,E)=>{E(11,10,10,5,'#2a4a6a');E(11,9,9,5,'#8fc4e8');E(9,7,6,3,'#d8f2ff');R(14,10,4,2,'#5a9acb');R(8,5,2,1,'#ffffff')}},
  {w:14,h:26,ax:7,ay:25,cr:7,co:6,mc:'#6fc3f0',p:R=>{const K='#1f3f66',A='#6fc3f0',B='#bff0ff',C='#3d86c4';
   R(5,6,5,19,K);R(6,7,3,18,A);R(6,7,1,17,B);R(7,3,1,4,K);R(7,4,1,3,B);R(1,13,4,12,K);R(2,14,2,11,C);R(9,15,4,10,K);R(10,16,2,9,A);R(10,16,1,8,B);R(1,24,12,1,K)}}],
 dc:[R=>{R(1,3,6,2,'#ffffff');R(2,2,4,1,'#ffffff');R(0,4,8,1,'#b4cde6')},
     R=>{R(1,2,1,3,'#7aa6c8');R(3,1,1,4,'#9cc2e0');R(5,2,1,3,'#7aa6c8')},
     R=>{R(1,1,2,2,'#a9c3dc');R(5,3,2,2,'#a9c3dc')}],
 en:[
  {k:'mor',n:'Morcego de Gelo',r:9,h:1.2,s:1.3,d:.9,S:16,p:(R,E,f)=>{const K='#10304f',B='#4aa3df',L='#bfeaff',y=f?8:2;
   R(6,6,4,6,K);R(7,7,2,4,B);R(6,4,1,3,K);R(9,4,1,3,K);R(7,8,1,1,'#ff4d4d');R(8,8,1,1,'#ff4d4d');R(7,11,2,2,K);
   R(0,y,6,4,K);R(1,y+1,5,2,B);R(0,y,2,1,L);R(10,y,6,4,K);R(10,y+1,5,2,B);R(14,y,2,1,L)}},
  {k:'lob',n:'Lobo Branco',r:12,h:3,s:1.1,d:1.2,S:16,p:(R,E,f)=>{const K='#2a3540',W='#e6eef5',G='#9fb2c4';
   E(7,9,5,3,K);E(7,9,4,2,W);R(3,10,6,1,G);
   R(11,5,4,4,K);R(12,6,3,2,W);R(15,7,1,2,K);R(11,3,1,3,K);R(13,3,1,2,K);R(13,6,1,1,'#ffd54f');
   R(0,6,3,3,K);R(1,6,2,2,W);
   R(3,12,2,3-f,K);R(5,12,2,2+f,K);R(9,12,2,3-f,K);R(11,12,2,2+f,K);R(3,12,1,2,W);R(9,12,1,2,W)}},
  {k:'yet',n:'Yeti',r:17,h:8,s:.75,d:1.7,S:16,p:(R,E,f)=>{const K='#1d2c44',W='#f2f7fb',G='#b8cbe0',Bl='#6cc8f0';
   R(4,0,8,6,K);R(5,1,6,4,W);R(6,2,4,3,Bl);R(6,3,1,1,'#ff4d4d');R(9,3,1,1,'#ff4d4d');R(7,4,2,1,K);
   R(2,5,12,8,K);R(3,5,10,7,W);R(3,9,10,1,G);R(4,7,2,1,G);R(10,7,2,1,G);
   R(0,6,3,8-f,K);R(1,6,1,7,W);R(13,6,3,7+f,K);R(14,6,1,6,W);
   R(3,12,4,3-f,K);R(9,12,4,2+f,K);R(4,12,2,2-f,W);R(10,12,2,1+f,W)}}],
 bs:{k:'rei',n:'Rei Gélido',S:32,p:(R,E,f)=>{const K='#10264a',A='#5fb4e6',B='#b8eaff',C='#3a7fc0';
   R(9,0,3,6,K);R(10,1,1,5,B);R(15,0,3,6,K);R(16,1,1,5,B);R(21,0,3,6,K);R(22,1,1,5,B);
   R(8,5,16,10,K);R(9,6,14,8,A);R(9,6,14,2,B);R(12,9,2,2,'#ff4d4d');R(18,9,2,2,'#ff4d4d');R(13,12,6,1,K);
   R(4,14,24,14,K);R(5,15,22,12,A);R(5,15,22,2,B);R(8,18,6,6,C);R(18,18,6,6,C);R(15,17,2,9,B);
   R(0,15+f,5,13,K);R(1,16+f,3,11,C);R(27,16-f,5,13,K);R(28,17-f,3,11,C);
   R(7,27,7,4-f,K);R(18,27,7,3+f,K);R(8,27,5,2,A);R(19,27,5,2,A)}}},

// ---------------------------------------------------------------- PANTANO
pantano:{name:'Pântano Sombrio',desc:'Brejo, salgueiros e fogos-fátuos. Sapos, trolls e a Bruxa do Brejo.',
 pal:{a:'#4a5a33',b:'#425029',c:'#2f3b1f',d:'#6c7f45',w:'#2c4a3c',we:'#5f8f6a',wd:'#1c3027',ws:'#9bd0a0'},
 g:{mode:'brejo',sc:7,th:.66,md:7,pt:.09,p0:.008,pr:.014,o1:[0,1,1],o2:[2,3]},
 hz:{c:'#3a4a2c',e:'#566b3a',s:'#8fa860',d:'#2a3820'},fx:{sp:.6},tip:'Lodaçal! A lama deixa você lento. Poças fundas bloqueiam.',
 am:{n:30,c:['#d8ff6a','#9bff8a'],vx:6,vy:-5,s:2,bl:1},
 os:[
  {w:28,h:36,ax:14,ay:35,cr:7,co:4,mc:'#2f3a22',p:R=>{const K='#1a140c',T='#4a3a26',T2='#6a5238',M='#5f8a3c',Mo='#7fb04a';
   R(11,14,6,21,K);R(12,14,4,21,T);R(12,14,1,21,T2);R(9,30,10,5,K);R(10,31,8,3,T);
   R(4,16,8,3,K);R(2,11,4,6,K);R(0,8,3,4,K);R(16,12,9,3,K);R(22,7,3,6,K);R(24,5,3,3,K);R(10,6,8,9,K);R(11,7,6,8,T);R(7,8,4,3,K);R(5,5,3,4,K);R(18,3,3,5,K);
   R(5,17,6,1,T2);R(3,12,2,4,T);R(17,13,7,1,T);R(4,19,1,6,M);R(7,19,1,4,Mo);R(18,15,1,7,M);R(21,15,1,5,Mo);R(2,17,1,4,M);R(13,14,1,3,Mo)}},
  {w:30,h:34,ax:15,ay:33,cr:8,co:4,mc:'#3d6b3a',p:(R,E)=>{const K='#12261a',G='#3c7a46',G2='#64a85a',T='#4a3626';
   R(13,18,5,15,K);R(14,18,3,15,T);E(15,10,14,9,K);E(15,10,13,8,G);E(12,8,7,4,G2);
   for(let x=2;x<29;x+=3){const l=8+((x*7)%9);R(x,16,1,l,K);R(x+1,16,1,l-2,G)}}},
  {w:20,h:20,ax:10,ay:19,cr:8,co:6,mc:'#a03a5a',p:(R,E)=>{const K='#2a0f1a',C='#c43e63',C2='#e8708f',W='#f4ecd6',S='#d7c9a8';
   R(8,10,4,9,K);R(9,10,2,9,W);R(9,10,1,9,S);E(10,7,9,6,K);E(10,7,8,5,C);R(4,5,2,2,W);R(9,3,3,2,W);R(14,6,2,2,W);R(5,4,2,1,C2);R(1,11,18,1,K)}},
  {w:20,h:14,ax:10,ay:13,cr:9,co:5,mc:'#5a4326',p:(R,E)=>{const K='#1a120a',T='#6a4a2a',T2='#8a6538',M='#5f8a3c';
   R(1,4,18,9,K);R(2,5,16,7,T);R(2,5,16,1,T2);R(1,12,18,1,K);R(2,6,2,4,T2);R(2,7,1,2,K);R(8,3,6,2,M);R(12,2,5,2,'#7fb04a');R(5,5,1,7,K);R(11,5,1,7,K)}}],
 dc:[R=>{R(1,2,1,3,'#3f6b2a');R(1,0,1,2,'#7a4a22');R(4,3,1,2,'#5a8a38');R(6,1,1,4,'#3f6b2a');R(6,0,1,2,'#7a4a22')},
     R=>{R(1,2,5,2,'#3c7a46');R(2,1,3,1,'#64a85a');R(5,2,1,1,'#e86aa0')},
     R=>{R(2,2,4,1,'#c43e63');R(3,3,2,2,'#f4ecd6');R(3,1,2,1,'#e8708f')}],
 en:[
  {k:'sap',n:'Sapo Venenoso',r:10,h:1.3,s:1.15,d:1,S:16,p:(R,E,f)=>{const K='#10241a',G='#4fae4a',L='#9be26a',Y='#e8e24a',P='#a14ad9';
   E(8,10,6,4-f,K);E(8,10,5,3-f,G);R(5,9,6,1,L);R(3,5,3,3,K);R(10,5,3,3,K);R(4,6,1,1,Y);R(11,6,1,1,Y);
   R(2,13,3,2,K);R(11,13,3,2,K);R(6,10,1,1,P);R(9,11,1,1,P)}},
  {k:'fat',n:'Fogo-fátuo',r:11,h:2.5,s:.95,d:1.1,S:16,p:(R,E,f)=>{const K='#0c2a2a',A='#3fe0c0',B='#b8fff0',C='#1a8f7f',y=f?0:1;
   R(6,1+y,4,2,K);R(5,3+y,6,3,K);R(4,6+y,8,4,K);R(5,10+y,6,2,K);R(6,12+y,4,1,K);
   R(7,2+y,2,1,B);R(6,4+y,4,2,A);R(5,7+y,6,3,A);R(6,10+y,4,1,C);R(6,7+y,1,2,K);R(9,7+y,1,2,K)}},
  {k:'tro',n:'Troll do Pântano',r:17,h:9,s:.7,d:1.7,S:16,p:(R,E,f)=>{const K='#1a2a12',G='#6a8f3a',L='#98bf5a',D='#4a6a2a';
   R(4,0,8,6,K);R(5,1,6,4,G);R(5,1,6,1,L);R(6,2,1,1,'#ffe14d');R(9,2,1,1,'#ffe14d');R(6,4,4,1,K);R(6,4,1,1,'#f4ecd6');R(9,4,1,1,'#f4ecd6');R(3,1,2,2,K);R(11,1,2,2,K);
   R(2,5,12,8,K);R(3,5,10,7,G);R(3,5,10,1,L);R(5,8,6,3,D);R(3,9,3,1,L);R(10,10,3,1,D);R(4,6,2,1,'#5fa84a');
   R(0,6,3,8-f,K);R(1,6,1,7,L);R(13,6,3,7+f,K);R(14,6,1,6,D);
   R(3,12,4,3-f,K);R(9,12,4,2+f,K);R(4,12,2,2,G);R(10,12,2,2,G)}}],
 bs:{k:'bru',n:'Bruxa do Brejo',S:32,p:(R,E,f)=>{const K='#1a0f2a',P='#6a3fa8',P2='#9b6ae0',G='#7fbf4a',G2='#b4e87a',Y='#ffe14d';
   R(15,0,3,2,K);R(12,2,8,3,K);R(13,3,6,2,P);R(10,5,12,2,K);R(14,6,5,1,Y);R(4,7,24,3,K);R(5,8,22,1,P);R(5,7,22,1,P2);
   R(10,10,12,9,K);R(11,11,10,7,G);R(11,11,10,1,G2);R(13,13,2,2,Y);R(17,13,2,2,Y);R(14,13,1,1,K);R(18,13,1,1,K);R(15,15,2,3,K);R(13,17,6,1,K);R(12,12,1,1,'#4a8a2a');
   R(5,19,22,11,K);R(6,19,20,10,P);R(6,19,4,10,P2);R(22,22,4,7,'#4a2a7a');R(13,19,6,2,Y);R(15,21,2,2,Y);
   R(1,14-f,2,16,'#3a2a1a');R(0,11-f,4,4,K);R(1,12-f,2,2,'#7dff9a');R(3,22,4,3,K);R(4,23,2,1,G)}}},

// ---------------------------------------------------------------- VULCAO
vulcao:{name:'Vulcão Infernal',desc:'Rios de lava e rocha negra. Diabretes, cães infernais e o Demônio.',
 pal:{a:'#3b2f38',b:'#342a33',c:'#251d26',d:'#574858',w:'#e14a16',we:'#ffb23e',wd:'#9b240c',ws:'#fff08a'},
 g:{mode:'fendas',sc:14,rw:.09,th:0,md:7,pt:.06,p0:.007,pr:.016,o1:[0,0,1],o2:[2,3]},
 hz:{c:'#e14a16',e:'#ffb23e',s:'#fff08a',d:'#9b240c'},fx:{sp:.9,dmg:{iv:.4,v:p=>2+p.mhp*.03}},tip:'A lava queima! Não pise nela.',
 am:{n:46,c:['#ff7a1a','#ffcf4a','#e14a16'],vx:6,vy:-48,s:2},
 os:[
  {w:20,h:30,ax:10,ay:29,cr:8,co:5,mc:'#2c2447',p:R=>{const K='#0a0814',A='#2c2447',B='#4a3d7a',C='#8a7ad0';
   R(8,2,4,26,K);R(9,3,2,25,A);R(9,3,1,24,B);R(9,0,2,3,K);R(2,12,4,16,K);R(3,13,2,15,A);R(3,13,1,14,B);R(3,10,2,3,K);R(14,9,4,19,K);R(15,10,2,18,A);R(15,10,1,17,B);R(15,7,2,3,K);
   R(9,6,1,1,C);R(3,16,1,1,C);R(15,13,1,1,C);R(0,27,20,2,K);R(1,27,18,1,'#3a2f38')}},
  {w:16,h:26,ax:8,ay:25,cr:8,co:6,mc:'#403650',p:R=>{const K='#0f0b14',A='#4a3f55',B='#6a5d78',D='#2c2536';
   R(1,4,14,21,K);R(2,5,12,19,A);R(2,5,3,19,B);R(10,5,4,19,D);R(5,5,1,19,K);R(10,5,1,19,K);R(2,9,12,1,K);R(2,16,12,1,K);R(3,5,10,1,B);R(0,24,16,1,K);R(11,2,3,3,K);R(12,3,2,2,A)}},
  {w:22,h:14,ax:11,ay:13,cr:12,co:6,mc:'#4a3a40',p:(R,E)=>{E(11,9,10,5,'#1a1018');E(11,8,9,5,'#4a3a40');R(7,5,3,1,'#6a5560');R(8,9,8,1,'#e14a16');R(12,9,2,1,'#ffb23e');R(5,7,1,3,'#e14a16')}},
  {w:18,h:16,ax:9,ay:15,cr:9,co:6,mc:'#5a4048',p:(R,E)=>{const K='#140c10',A='#5a4048',B='#7a5a60',O='#e14a16',Y='#ffcf4a';
   E(9,11,8,4,K);E(9,10,7,4,A);R(3,9,12,1,B);E(9,8,4,2,K);R(7,8,4,1,O);R(8,8,2,1,Y);R(6,13,2,1,B);R(11,12,2,1,K)}}],
 dc:[R=>{R(1,3,6,2,'#6a5a6a');R(2,2,4,1,'#8a7a8a');R(0,4,8,1,'#4a3c4a')},
     R=>{R(1,1,1,2,'#e14a16');R(2,3,2,1,'#e14a16');R(4,2,1,2,'#ffb23e');R(5,1,2,1,'#e14a16')},
     R=>{R(0,2,2,2,'#cfc8d8');R(2,3,4,1,'#cfc8d8');R(6,2,2,2,'#cfc8d8');R(0,4,1,1,'#8e88a0')}],
 en:[
  {k:'dia',n:'Diabrete',r:10,h:1.3,s:1.2,d:1,S:16,p:(R,E,f)=>{const K='#2a0808',R1='#d83a1e',R2='#ff7a3a',Y='#ffe14d';
   R(4,0,2,3,K);R(10,0,2,3,K);R(4,0,1,2,'#e8e0d0');R(11,0,1,2,'#e8e0d0');
   R(4,3,8,5,K);R(5,4,6,3,R1);R(5,4,6,1,R2);R(5,5,1,1,Y);R(10,5,1,1,Y);R(7,6,2,1,K);
   R(5,8,6,4,K);R(6,8,4,3,R1);R(1,7+f,4,3,K);R(11,7+f,4,3,K);R(2,8+f,2,1,R2);R(12,8+f,2,1,R2);
   R(5,12,2,3-f,K);R(9,12,2,2+f,K);R(11,11,3,1,K);R(13,10,2,2,K)}},
  {k:'cao',n:'Cão Infernal',r:12,h:3,s:1.15,d:1.2,S:16,p:(R,E,f)=>{const K='#1a0606',B='#6a1a12',R1='#d83a1e',Y='#ffcf4a';
   E(7,9,5,3,K);E(7,9,4,2,B);R(3,8,8,1,R1);
   R(11,4,4,5,K);R(12,5,3,3,B);R(15,6,1,2,K);R(11,2,1,3,K);R(13,2,1,2,K);R(13,5,1,1,Y);R(12,8,1,1,'#ffffff');
   R(0,6,3,3,K);R(1,6,1,2,R1);R(0,4,2,2,Y);R(8,5+f,2,2,R1);R(6,6-f,2,2,Y);
   R(3,12,2,3-f,K);R(5,12,2,2+f,K);R(9,12,2,3-f,K);R(11,12,2,2+f,K)}},
  {k:'gol',n:'Golem de Lava',r:17,h:9,s:.7,d:1.8,S:16,p:(R,E,f)=>{const K='#140a0a',A='#3a2a2e',B='#5a444a',O='#ff6a1e',Y='#ffcf4a';
   R(4,0,8,5,K);R(5,1,6,3,A);R(6,2,1,1,Y);R(9,2,1,1,Y);R(6,3,4,1,O);
   R(2,5,12,8,K);R(3,5,10,7,A);R(3,5,10,1,B);R(5,6,1,5,O);R(6,8,3,1,O);R(10,7,1,3,O);R(8,6,1,1,Y);R(4,10,3,1,O);
   R(0,6,3,8,K);R(1,6,1,7,B);R(1,12,1,1,O);R(13,6,3,8,K);R(14,6,1,7,B);R(14,11,1,1,O);
   R(3,12,4,3-f,K);R(4,12,2,2-f,A);R(9,12,4,2+f,K);R(10,12,2,1+f,A);R(4,13-f,2,1,O)}}],
 bs:{k:'dem',n:'Demônio',S:32,p:(R,E,f)=>{const K='#1a0408',Rr='#c4301c',R2='#ff6a3a',D='#7a1810',Y='#ffe14d',H='#efe6d4';
   R(7,2,4,8,K);R(8,3,2,6,H);R(6,0,3,4,K);R(7,1,1,2,H);R(21,2,4,8,K);R(22,3,2,6,H);R(23,0,3,4,K);R(24,1,1,2,H);
   R(0,12+f,8,12,K);R(1,13+f,6,10,D);R(24,12+f,8,12,K);R(25,13+f,6,10,D);
   R(10,6,12,10,K);R(11,7,10,8,Rr);R(11,7,10,2,R2);R(12,10,3,2,Y);R(17,10,3,2,Y);R(13,10,1,1,K);R(18,10,1,1,K);R(13,14,6,1,K);R(14,15,1,2,H);R(17,15,1,2,H);
   R(8,16,16,13,K);R(9,16,14,12,Rr);R(9,16,14,2,R2);R(12,19,8,6,D);R(14,20,4,3,R2);R(15,21,2,1,Y);
   R(10,29,5,3,K);R(17,29,5,3,K)}}},

// ---------------------------------------------------------------- ABISMO ESTELAR
abismo:{name:'Abismo Estelar',desc:'Cristais flutuando no vazio. Olhos cósmicos e o Devorador de Estrelas.',
 pal:{a:'#1a1238',b:'#211745',c:'#120c28',d:'#6a56d0',w:'#05030c',we:'#a64aff',wd:'#2e0e5e',ws:'#ffffff'},
 g:{mode:'vazio',sc:18,th:.6,md:7,pt:.05,p0:.006,pr:.015,o1:[0,0,1],o2:[2,3]},
 hz:{c:'#2a1c5a',e:'#7a4ad8',s:'#b88cff',d:'#1a1238'},fx:{sp:1},tip:'Runas de teleporte! Pisar nelas leva você para longe.',
 am:{n:50,c:['#ffffff','#9ef6ff','#c9a8ff'],vx:-8,vy:3,s:2,bl:1},
 os:[
  {w:16,h:32,ax:8,ay:31,cr:8,co:6,mc:'#7a4ad8',p:R=>{const K='#12082a',A='#7a4ad8',B='#b88cff',C='#4a2a9a',W='#e8d8ff';
   R(6,2,4,3,K);R(7,3,2,2,B);R(4,5,8,22,K);R(5,6,6,20,A);R(5,6,2,20,B);R(9,6,2,20,C);R(7,8,1,8,W);R(2,16,3,12,K);R(3,17,1,10,C);R(11,13,3,15,K);R(12,14,1,13,A);R(1,27,14,2,K);R(2,27,12,1,C)}},
  {w:14,h:28,ax:7,ay:27,cr:7,co:6,mc:'#3a3470',p:R=>{const K='#0c0a1e',A='#3a3470',B='#5a52a8',G='#52f0ff';
   R(2,2,10,25,K);R(3,3,8,23,A);R(3,3,2,23,B);R(5,8,4,1,G);R(6,9,2,3,G);R(5,14,4,1,G);R(5,16,1,3,G);R(8,16,1,3,G);R(5,21,4,1,G);R(0,26,14,2,K);R(1,26,12,1,A)}},
  {w:22,h:16,ax:11,ay:15,cr:12,co:6,mc:'#4a4478',p:(R,E)=>{E(11,9,10,6,'#0c0a1e');E(11,8,9,5,'#4a4478');R(6,5,4,2,'#6a62a0');E(15,10,2,2,'#2a2650');R(9,9,2,1,'#2a2650')}},
  {w:18,h:16,ax:9,ay:15,cr:8,co:5,mc:'#2fa8c8',p:R=>{const K='#12082a',A='#52f0ff',B='#b8fbff',C='#2fa8c8';
   R(2,5,4,10,K);R(3,6,2,9,A);R(3,6,1,8,B);R(7,1,5,14,K);R(8,2,3,13,A);R(8,2,1,12,B);R(10,4,1,10,C);R(13,7,4,8,K);R(14,8,2,7,C);R(1,14,16,1,K)}}],
 dc:[R=>{R(2,1,1,3,'#cfc4ff');R(1,2,3,1,'#cfc4ff');R(2,2,1,1,'#ffffff')},
     R=>{R(2,1,2,4,'#52f0ff');R(2,1,1,3,'#b8fbff')},
     R=>{R(1,1,5,1,'#7a4ad8');R(1,1,1,4,'#7a4ad8');R(5,1,1,4,'#7a4ad8');R(3,3,1,2,'#b88cff')}],
 en:[
  {k:'olh',n:'Olho Flutuante',r:10,h:1.3,s:1.15,d:1,S:16,p:(R,E,f)=>{const K='#12082a',W='#f4f0ff',I='#a64aff',P='#05030c',y=f?0:1;
   E(8,8+y,6,5,K);E(8,8+y,5,4,W);E(8,8+y,2,3,I);R(8,7+y,1,2,P);R(7,7+y,1,1,'#ffffff');R(4,6+y,1,1,'#ff4d6a');R(11,9+y,1,1,'#ff4d6a');R(1,6+y,2,3,K);R(13,6+y,2,3,K)}},
  {k:'med',n:'Água-viva do Vazio',r:12,h:2.6,s:.95,d:1.1,S:16,p:(R,E,f)=>{const K='#1a0a3a',A='#c06aff',B='#f0c8ff',C='#7a3ad0';
   E(8,6,6,5,K);E(8,6,5,4,A);R(4,3,4,2,B);R(7,2,3,1,B);R(5,7,6,1,C);R(6,6,1,2,K);R(9,6,1,2,K);
   for(let i=0;i<4;i++){const x=4+i*3+((i+f)%2);R(x,11,1,4,K);R(x,11,1,3,A)}}},
  {k:'sen',n:'Sentinela Cósmica',r:17,h:8,s:.75,d:1.7,S:16,p:(R,E,f)=>{const K='#0a0820',A='#4a4aa0',B='#7a7ae0',C='#2a2a70',G='#52f0ff';
   R(4,0,8,6,K);R(5,1,6,4,A);R(5,1,6,1,B);R(5,3,6,1,G);
   R(2,5,12,8,K);R(3,5,10,7,A);R(3,5,10,1,B);R(7,7,2,3,G);R(4,9,3,1,C);R(9,9,3,1,C);
   R(0,7,3,6-f,K);R(1,7,1,5,B);R(13,7,3,5+f,K);R(14,7,1,4,B);
   R(3,12,4,3-f,K);R(9,12,4,2+f,K);R(4,12,2,2-f,C);R(10,12,2,1+f,C)}}],
 bs:{k:'dev',n:'Devorador de Estrelas',S:32,p:(R,E,f)=>{const K='#0a0420',W='#f4f0ff',I='#a64aff',I2='#e0a8ff',P='#05030c',T='#4a1a9a',T2='#7a3ad8',y=f?0:1;
   E(16,13+y,13,11,K);E(16,13+y,12,10,W);E(16,13+y,6,7,I);E(16,13+y,4,5,I2);E(16,13+y,2,4,P);R(14,10+y,2,2,'#ffffff');
   R(6,10+y,3,1,'#ff4d6a');R(9,11+y,2,1,'#ff4d6a');R(22,16+y,4,1,'#ff4d6a');R(24,12+y,2,1,'#ff4d6a');R(10,19+y,1,3,'#ff4d6a');
   for(let i=0;i<6;i++){const x=2+i*5,w=(i+f)%2;R(x+w,25,3,7,K);R(x+w+1,25,1,6,i%2?T:T2)}
   R(3,2+y,3,5,K);R(4,3+y,1,3,T2);R(26,2+y,3,5,K);R(27,3+y,1,3,T2);R(15,0+y,2,3,K);R(15,1+y,2,1,T2)}}}
};

// registro: entra no menu de mapas (antes do Modo de Teste) e nas ondas de inimigos
try{
 const tst=MAPS.teste;delete MAPS.teste;
 for(const k in NM){MAPS[k]={name:NM[k].name,desc:NM[k].desc};WV.ini[k]=14}
 MAPS.teste=tst;
 const _of=WV.of;
 WV.of=function(m,w){const M=NM[m];if(!M)return _of.call(WV,m,w);const ks=M.en.map(e=>e.k),n=ks.length,q=Math.min(w,30),i=Math.min(n-1,Math.floor(w*n/18));
  return{min:Math.min(280,15+8*q),iv:Math.max(.8,2-.05*q),ty:w>=24?ks:ks.slice(Math.max(0,i-1),i+1)}};
}catch(e){console.warn('maps.js: falha ao registrar mapas',e)}
