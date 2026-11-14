(()=>{
const cv=document.getElementById('c'),cx=cv.getContext('2d'),$=id=>document.getElementById(id);
let W,H,Z=1,DPR=1;const vr=()=>Math.hypot(W,H)/(2*Z);function rs(){W=innerWidth;H=innerHeight;DPR=Math.min(devicePixelRatio||1,2);cv.width=W*DPR;cv.height=H*DPR;Z=Math.max(.7,Math.min(1.5,Math.min(W,H)/720));cx.setTransform(DPR,0,0,DPR,0,0)}addEventListener('resize',rs);rs();
// ---------- meta ----------
let meta={coins:0,lv:{}},user='';
function loadUser(n){user=n;try{localStorage.setItem('vs_user',n)}catch(e){}meta={coins:0,lv:{}};try{const m=JSON.parse(localStorage.getItem('vs_meta_'+n));if(m)meta=m}catch(e){}$('who').textContent=n;$('coins').textContent=meta.coins;curChar=(meta.ch&&CHARS[meta.ch]&&unlocked(meta.ch))?meta.ch:'merlin';$('chr').textContent=CHARS[curChar].name}
const save=()=>{try{localStorage.setItem('vs_meta_'+user,JSON.stringify(meta))}catch(e){}};
const ml=id=>meta.lv[id]||0;
function shop(){$('coins').textContent=$('coins2').textContent=meta.coins;$('shop').innerHTML='';
 MS.forEach(m=>{const l=ml(m.id),mx=m.mx||5,c=Math.round(m.b*2*Math.pow(1.7,l)),b=document.createElement('button');b.className='card';
  b.innerHTML=`<b>${m.n}</b><small>${m.d}</small><span>Nv ${l}/${mx}</span><span>${l>=mx?'MÁX':c+' 🪙'}</span>`;
  b.disabled=l>=mx||meta.coins<c;b.onclick=()=>{meta.coins-=c;meta.lv[m.id]=l+1;save();shop()};$('shop').appendChild(b)})}
// ---------- itens ----------
// ---------- sprites (pixel art 16x16; PX = tamanho do pixel no mundo, igual para todos os sprites) ----------
// ---------- personagens jogaveis (spritesheet 3 colunas x 4 linhas: baixo, esquerda, direita, cima) ----------
const CHARS={merlin:{name:'Merlin',fw:32,fh:32,ax:16,ay:12,by:21,seq:[1,0,1,2],idle:1,start:'wand',ok:false,img:new Image()},
 mrww:{name:'Mr.WorldWide',fw:32,fh:32,ax:16,ay:16,by:32,seq:[0,1,2,3],idle:0,sc:.5,start:'knife',locked:true,unlock:{map:'cidadela',chance:.4,minD:1200,maxD:2600},hint:'Bloqueado: procure por ele na Cidadela.',ok:false,img:new Image()}};
let curChar='merlin';
for(const k in CHARS){const C=CHARS[k];C.img.onload=()=>{C.ok=true}}
CHARS.merlin.img.src=SPR_24;
CHARS.mrww.img.src=SPR_25;
// iguala a altura visivel do Mr.WorldWide a do Merlin (mede o 1o quadro de cada um e ajusta a escala dele)
function fitChar(){const a=CHARS.merlin,b=CHARS.mrww;if(!a.ok||!b.ok)return;const vh=C=>{const c=document.createElement('canvas');c.width=C.fw;c.height=C.fh;const g=c.getContext('2d');g.drawImage(C.img,C.idle*C.fw,0,C.fw,C.fh,0,0,C.fw,C.fh);const d=g.getImageData(0,0,C.fw,C.fh).data;let t=-1,u=0;for(let y=0;y<C.fh;y++)for(let x=0;x<C.fw;x++)if(d[(y*C.fw+x)*4+3]>16){if(t<0)t=y;u=y}return t<0?C.fh:u-t+1};try{b.sc=(a.sc||1)*vh(a)/vh(b)}catch(e){}}
CHARS.merlin.img.addEventListener('load',fitChar);CHARS.mrww.img.addEventListener('load',fitChar);
$('chr').textContent=CHARS[curChar].name;
function drawPlayer(p){const C=CHARS[curChar];
 if(!C.ok){cx.fillStyle='#4caf50';cx.beginPath();cx.arc(W/2,H/2,12*Z,0,6.283);cx.fill();return}
 const s=Math.max(.5,Math.max(1,Math.round(PX*Z*DPR))*(C.sc||1)),f=p.mv?C.seq[Math.floor(G.t*8)%C.seq.length]:C.idle,row=p.dir||0;
 const mx=W*DPR/2,my=H*DPR/2,x=Math.round(mx-C.ax*s)/DPR,y=Math.round(my-C.ay*s)/DPR,w=C.fw*s/DPR,h=C.fh*s/DPR;
 cx.save();cx.imageSmoothingEnabled=false;
 cx.fillStyle='#0005';cx.fillRect(Math.round(mx-5*s)/DPR,Math.round(my+(C.by-C.ay-1)*s)/DPR,10*s/DPR,s/DPR);
 if(p.inv>0&&Math.floor(G.t*20)%2)cx.globalAlpha=.4;
 cx.drawImage(C.img,f*C.fw,row*C.fh,C.fw,C.fh,x,y,w,h);cx.restore()}
// ---------- sprite dos slimes (spritesheet embutido, 4 quadros x 4 direcoes, 32x32 cada) ----------
const SL={img:new Image(),ok:false};SL.img.onload=()=>{SL.ok=true};SL.img.src=SPR_26;
const SL2={img:new Image(),ok:false};SL2.img.onload=()=>{SL2.ok=true};SL2.img.src=SPR_27;
const SL3={img:new Image(),ok:false};SL3.img.onload=()=>{SL3.ok=true};SL3.img.src=SPR_28;
function slime(e,tint,S,k){S=S||SL;k=k||1;const a=Math.atan2(G.p.y-e.y,G.p.x-e.x),cs=Math.cos(a),sn=Math.sin(a),row=Math.abs(cs)>Math.abs(sn)?(cs>0?3:2):(sn>0?0:1);
 if(e.ph===undefined)e.ph=Math.random()*6;const f=[0,1,2,3,2,1][Math.floor(G.t*8+e.ph)%6];
 cx.imageSmoothingEnabled=false;cx.drawImage(S.img,f*32,row*32,32,32,Math.round(e.x-16*k),Math.round(e.y-16*k),Math.round(32*k),Math.round(32*k));
 if(tint){cx.globalAlpha=.45;cx.fillStyle=tint;cx.beginPath();cx.arc(e.x,e.y+k,8*k,0,6.283);cx.fill();cx.globalAlpha=1}}
// ---------- icones dos drops (cristal azul = XP, moeda = dinheiro; 16x16) ----------
['gem','coin'].forEach(k=>{IC[k]={img:new Image(),ok:false};IC[k].img.onload=()=>{IC[k].ok=true}});
IC.gem.img.src=SPR_29;IC.coin.img.src=SPR_30;
['gemg','gemp','heart','nuke','roots'].forEach(k=>{IC[k]={img:new Image(),ok:false};IC[k].img.onload=()=>{IC[k].ok=true}});
IC.gemg.img.src=SPR_31;IC.gemp.img.src=SPR_32;
IC.heart.img.src=SPR_33;IC.nuke.img.src=SPR_34;IC.roots.img.src=SPR_35;
(()=>{const rows=['................','....KKKKKKKK....','...KrrrrrrrrK...','..KrRRRRRRRRrK..','.KrRKKKKKKKKRrK.','.KrRK......KRrK.','.KrRK......KRrK.','.KrRK......KRrK.','.KrRK......KRrK.','.KrRK......KRrK.','.KrRK......KRrK.','.KsSK......KsSK.','.KsSK......KsSK.','.KKKK......KKKK.','................','................'],pal={K:'#1a1033',r:'#c0392b',R:'#ff6b5b',s:'#aeb4c8',S:'#eef1fa'},c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');
 rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));IC.magnet={img:c,ok:true}})();
function freeSpot(x,y,r){if(!blk(x,y,r))return{x,y};for(let d=10;d<=240;d+=10){const n=Math.max(8,Math.round(d/4));for(let i=0;i<n;i++){const a=i/n*6.283,px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;if(!blk(px,py,r))return{x:px,y:py}}}return{x,y}}
function useItem(k){const p=G.p,vw=W/(2*Z)+20,vh=H/(2*Z)+20,on=e=>!e.dead&&Math.abs(e.x-p.x)<vw&&Math.abs(e.y-p.y)<vh;
 if(k==='heart'){const h=Math.ceil(p.mhp*.25);p.hp=Math.min(p.mhp,p.hp+h);toast('Coração: +'+h+' de vida!')}
 else if(k==='nuke'){G.E.forEach(e=>{if(on(e)){if(!e.boss)hurt(e,e.hp+1,'magico')}});G.fl=.4;G.flc='#ffffff';toast('Cometa: inimigos da tela eliminados! (bosses resistem)')}
 else if(k==='magnet'){G.O.forEach(o=>{o.g=1});G.fl=.25;G.flc='#6fa8ff';toast('Ímã: todo o XP vem até você!')}
 else{G.E.forEach(e=>{if(on(e))e.rt=4});G.fl=.3;G.flc='#6fbf4a';toast('Raízes: inimigos imobilizados!')}}
function icon(k,x,y,fb,r,sz){const I=IC[k];if(I.ok){cx.imageSmoothingEnabled=false;const z=sz||16;cx.drawImage(I.img,Math.round(x-z/2),Math.round(y-z/2),z,z)}else{cx.fillStyle=fb;cx.beginPath();cx.arc(x,y,r,0,6.283);cx.fill()}}
// ---------- baus (madeira = caixas quebraveis; dourado = bau do boss; 3 quadros de 18x17) ----------
const CS={wood:{img:new Image(),ok:false},gold:{img:new Image(),ok:false}};
for(const k in CS){CS[k].img.onload=()=>{CS[k].ok=true}}
CS.wood.img.src=SPR_36;CS.gold.img.src=SPR_37;
const HB=CIDH.map(s=>{const o={img:new Image(),ok:false};o.img.onload=()=>{o.ok=true};o.img.src=s;return o});
const CB=CIDB.map(s=>{const o={img:new Image(),ok:false};o.img.onload=()=>{o.ok=true};o.img.src=s;return o});
function cityBox(b){const o=CB[b.v||0];if(!o||!o.ok){chestSpr('wood',b.x,b.y,'#8d6e3f',24,24);return}const w=o.img.naturalWidth,h=o.img.naturalHeight,k=Math.min(2,36/w,34/h);cx.imageSmoothingEnabled=false;cx.drawImage(o.img,Math.round(b.x-w*k/2),Math.round(b.y-h*k/2),Math.round(w*k),Math.round(h*k))}
function chestSpr(k,x,y,fb,w,h){const C=CS[k];if(C.ok){cx.imageSmoothingEnabled=false;cx.drawImage(C.img,(Math.floor(G.t*4)%3)*18,0,18,17,Math.round(x-18),Math.round(y-17),36,34)}else{cx.fillStyle=fb;cx.fillRect(x-w/2,y-h/2,w,h)}}
// ---------- mapa procedural (tileset natural.png; semente nova a cada run) ----------
const TS=32,TSET={img:new Image(),ok:false};const TC=new Map();
TSET.img.onload=()=>{TSET.ok=true};TSET.img.src=SPR_38;
function hsh(x,y,s){let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(SEED+s*7919|0,2246822519);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296}
function vn(x,y,sc,s){x/=sc;y/=sc;const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),a=hsh(xi,yi,s),b=hsh(xi+1,yi,s),c=hsh(xi,yi+1,s),d=hsh(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function T(tx,ty){return curMap==='cidadela'?TY(tx,ty):TF(tx,ty)}
function TF(tx,ty){const k=(tx+32768)*65536+(ty+32768);let t=TC.get(k);if(t)return t;if(TC.size>80000)TC.clear();
 const d=Math.hypot(tx,ty),n=.7*vn(tx,ty,9,1)+.3*vn(tx,ty,4,3);
 t={w:d>7&&n>.64,v:hsh(tx,ty,5)<.25,o:null,m:-1,d:-1};
 if(!t.w&&d>4){const f=vn(tx,ty,14,2),r=hsh(tx,ty,7),pt=f>.55?.09:.007,pr=.012,h=hsh(tx,ty,9);let key=null;
  if(r<pt)key=h<.45?'t0':h<.65?'t1':h<.8?'t2':'t3';else if(r<pt+pr)key=h<.15?'r0':h<.5?'r1':h<.75?'r2':'r3';
  if(key){const s=OB[key],y=ty*TS+TS-4+(hsh(tx,ty,11)-.5)*6;t.o={x:tx*TS+TS/2+(hsh(tx,ty,13)-.5)*10,y,s,cr:s.cr,cy:y-s.co}}
  else if(r<pt+pr+.14){t.d=Math.floor(hsh(tx,ty,15)*DC.length);t.dx=hsh(tx,ty,17)*(TS-14);t.dy=hsh(tx,ty,19)*(TS-10)}}
 TC.set(k,t);return t}
function blk(x,y,r){const a=Math.floor((x-r)/TS),b=Math.floor((x+r)/TS),c=Math.floor((y-r)/TS),e=Math.floor((y+r)/TS);
 for(let ty=c;ty<=e;ty++)for(let tx=a;tx<=b;tx++)if(T(tx,ty).w){const qx=Math.max(tx*TS,Math.min(x,tx*TS+TS)),qy=Math.max(ty*TS,Math.min(y,ty*TS+TS));if((x-qx)*(x-qx)+(y-qy)*(y-qy)<r*r)return true}
 for(let ty=c-1;ty<=e+1;ty++)for(let tx=a-1;tx<=b+1;tx++){const o=T(tx,ty).o;if(o){const dx=x-o.x,dy=y-o.cy,rr=r+o.cr;if(dx*dx+dy*dy<rr*rr)return true}}
 return false}
function mvE(o,dx,dy,r){const nx=o.x+dx,ny=o.y+dy;if(blk(o.x,o.y,r)||!blk(nx,ny,r)){o.x=nx;o.y=ny;return}
 if(!blk(nx,o.y,r)){o.x=nx;return}if(!blk(o.x,ny,r)){o.y=ny;return}
 if(o.sp!==undefined)for(const sg of[1,-1]){const rx=dx*.5-sg*dy*.866,ry=dy*.5+sg*dx*.866;if(!blk(o.x+rx,o.y+ry,r)){o.x+=rx;o.y+=ry;return}}}
function drawGround(){if(curMap==='cidadela'){drawCity();return}const p=G.p,x0=Math.floor((p.x-W/2/Z)/TS)-1,x1=Math.ceil((p.x+W/2/Z)/TS)+1,y0=Math.floor((p.y-H/2/Z)/TS)-1,y1=Math.ceil((p.y+H/2/Z)/TS)+1;
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const t=T(tx,ty),x=tx*TS,y=ty*TS;
  cx.fillStyle=t.w?'#6eccc9':t.v?'#9ec96a':'#a3cc6e';cx.fillRect(x,y,TS+1,TS+1);
  if(t.w){if(t.m<0)t.m=(T(tx,ty-1).w?0:1)|(T(tx+1,ty).w?0:2)|(T(tx,ty+1).w?0:4)|(T(tx-1,ty).w?0:8);const m=t.m;
   if(m){cx.fillStyle='#c4f1ee';if(m&1)cx.fillRect(x,y,TS+1,4);if(m&2)cx.fillRect(x+TS-4,y,4,TS+1);if(m&4)cx.fillRect(x,y+TS-4,TS+1,4);if(m&8)cx.fillRect(x,y,4,TS+1)}}
  else if(t.d>=0&&TSET.ok){const s=DC[t.d];cx.imageSmoothingEnabled=false;cx.drawImage(TSET.img,s.x,s.y,s.w,s.h,Math.round(x+t.dx),Math.round(y+t.dy),s.w*2,s.h*2)}}}
function drawObs(front){const p=G.p;
 if(!front){OL=[];const x0=Math.floor((p.x-W/2/Z)/TS)-2,x1=Math.ceil((p.x+W/2/Z)/TS)+2,y0=Math.floor((p.y-H/2/Z)/TS)-1,y1=Math.ceil((p.y+H/2/Z)/TS)+4;
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const o=T(tx,ty).o;if(o)OL.push(o)}OL.sort((a,b)=>a.y-b.y)}
 else{cx.save();cx.translate(W/2-p.x*Z,H/2-p.y*Z);cx.scale(Z,Z)}
 if(TSET.ok){cx.imageSmoothingEnabled=false;for(const o of OL)if(front?o.y>p.y:o.y<=p.y){const s=o.s;cx.drawImage(TSET.img,s.x,s.y,s.w,s.h,Math.round(o.x-s.ax*2),Math.round(o.y-s.ay*2),s.w*2,s.h*2)}}
 if(front)cx.restore()}
// ---------- sprite da Varinha Magica (4 quadros 16x16; cabeca da bola de fogo no ponto de ancora) ----------
const WS={img:new Image(),ok:false,hx:11.97,hy:4.03,off:-0.8173};WS.img.onload=()=>{WS.ok=true};WS.img.src=SPR_39;
function wandSpr(q){if(q.ph===undefined)q.ph=Math.random()*4;const f=Math.floor(G.t*12+q.ph)%4,k=2*q.r/6;
 cx.save();cx.translate(q.x,q.y);cx.rotate(Math.atan2(q.vy,q.vx)-WS.off);cx.imageSmoothingEnabled=false;
 cx.drawImage(WS.img,f*16,0,16,16,-WS.hx*k,-WS.hy*k,16*k,16*k);cx.restore()}
// ---------- sprite do Relampago (8 quadros 72x72; raio diagonal que cai sobre o alvo) ----------
const LS={img:new Image(),ok:false,w:72,h:72,ax:68,ay:68,rot:Math.PI/4};LS.img.onload=()=>{LS.ok=true};LS.img.src=SPR_40;
function boltSpr(f){const i=Math.min(7,Math.floor((1-f.t/f.d)*8)),k=2*f.r/30;
 cx.save();cx.beginPath();cx.rect(f.x-400,f.y-800,800,806);cx.clip();cx.translate(f.x,f.y);cx.rotate(LS.rot);cx.imageSmoothingEnabled=false;cx.drawImage(LS.img,i*72,0,72,72,-LS.ax*k,-LS.ay*k,72*k,72*k);cx.restore();
 cx.globalAlpha=Math.max(0,f.t*3);cx.fillStyle='#fff7b0';cx.beginPath();cx.arc(f.x,f.y,f.r*.5,0,6.283);cx.fill();cx.globalAlpha=1}
// ---------- sprite das Orbes (frame 0 = bola; frames 1-3 = explosao; nasce em 3-2-1 e some em 1-2-3) ----------
const OS={img:new Image(),ok:false};OS.img.onload=()=>{OS.ok=true};OS.img.src=SPR_41;
function orbSpr(x,y,r){if(!OS.ok){cx.fillStyle='#ff7043';cx.beginPath();cx.arc(x,y,r,0,6.283);cx.fill();return}
 const ph=G.orbPh,on=G.orbDur,fx=.25;let f=0;
 if(ph<fx)f=3-Math.min(2,Math.floor(ph/fx*3));else if(ph>on-fx)f=1+Math.min(2,Math.floor((ph-(on-fx))/fx*3));
 const k=2*r/9;cx.imageSmoothingEnabled=false;cx.drawImage(OS.img,f*24,0,24,24,Math.round(x-12*k),Math.round(y-12*k),24*k,24*k)}
// ---------- sprite da Faca (16x16; lamina aponta para cima e a direita; gira conforme a direcao do arremesso) ----------
const KS={img:new Image(),ok:false};KS.img.onload=()=>{KS.ok=true};KS.img.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdUlEQVR42mNgGPKAkQS1/7HpYyJW8////xmO37mAIcFErOYTdy8yXDn/iGQv/v//////43cu/J+9etN/NG8QDIP/MCdfOf+IITXUD6t6Flyan03wY9gKdTIuzXid/myC3/+zGbZYnU1QM5JGijSTBSjSPEQBAM/yPRNdhDiDAAAAAElFTkSuQmCC';
function knifeSpr(q){const k=2*q.r/5;cx.save();cx.translate(q.x,q.y);cx.rotate(Math.atan2(q.vy,q.vx)+Math.PI/4);cx.imageSmoothingEnabled=false;
 cx.drawImage(KS.img,-8*k,-8*k,16*k,16*k);cx.restore()}
// ---------- musica (toca somente durante a run; webm/opus com fallback mp3; tecla M = mudo) ----------
const MUSF=new Audio(new Audio().canPlayType('audio/webm; codecs=opus')?SPR_1:SPR_2),MUSC=new Audio('Assets/Musicas/Cidadela.mp3');let MUS=MUSF;
MUSF.loop=MUSC.loop=true;MUSF.volume=MUSC.volume=.35;
function musicOn(){try{const o=MUS;o.pause();MUS=curMap==='cidadela'?MUSC:MUSF;MUS.muted=o.muted;MUS.volume=Math.min(1,VOL.m/100);MUS.currentTime=0;const p=MUS.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function musicOff(){try{MUS.pause()}catch(e){}}
// ---------- sprite do Machado (26x29; gira enquanto voa) e som de level up ----------
const AS={img:new Image(),ok:false};AS.img.onload=()=>{AS.ok=true};AS.img.src=SPR_42;
function axeSpr(q){const k=1.5*q.r/10;cx.save();cx.translate(q.x,q.y);cx.rotate(-q.life*14);cx.imageSmoothingEnabled=false;
 cx.drawImage(AS.img,-13*k,-14*k,26*k,29*k);cx.restore()}
const SFX=new Audio(SPR_3);SFX.volume=.35;
const SWS=new Audio(SPR_4);SWS.volume=.4;
const WSND=new Audio(SPR_5);WSND.volume=.3;
function sfxWand(){try{WSND.currentTime=0;const p=WSND.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
const KSND=new Audio(SPR_43);KSND.volume=.3;
function sfxKnife(){try{KSND.currentTime=0;const p=KSND.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
const BSND=new Audio(SPR_6);BSND.volume=.35;let bsT=0;
function sfxBolt(){const n=Date.now();if(n-bsT<80)return;bsT=n;try{BSND.currentTime=0;const p=BSND.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function sfxAxe(){try{SWS.currentTime=0;const p=SWS.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function sfxLevel(){try{SFX.currentTime=0;const p=SFX.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
// ---------- impacto visual ao acertar (faiscas na cor do tipo de dano) ----------
function hitFx(e,t){const H=G.HP||(G.HP=[]);if(H.length>250)return;const cs=HC[t]||HC.fisico;
 for(let i=0;i<5;i++){const a=Math.random()*6.283,v=70+Math.random()*90;H.push({x:e.x,y:e.y-e.r*.3,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.22+Math.random()*.18,c:cs[i%3],s:2+Math.floor(Math.random()*3)})}}
// ---------- versao e patch notes ----------
// A cada atualizacao: ajuste VERSION e adicione uma entrada NO TOPO de PATCHES.
// Regra: pouco conteudo = muda so o ultimo numero (2.3.1 -> 2.3.2); conteudo medio = muda o do meio e zera o ultimo (2.3.1 -> 2.4.0); conteudo massivo = muda o primeiro e zera o resto (2.3.1 -> 3.0.0).
function seenOk(){try{return localStorage.getItem('vs_seen')===VERSION}catch(e){return true}}
function renderNotes(){const box=$('nl');box.textContent='';
 PATCHES.forEach((p,i)=>{const d=document.createElement('div'),h=document.createElement('h3'),ul=document.createElement('ul');d.className='pn';
  h.textContent='v'+p.v+(p.d?'  -  '+p.d:'')+(i===0?'  (ATUAL)':'');
  p.n.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li)});d.append(h,ul);box.appendChild(d)})}
// ---------- opcoes de audio (volume de musica e de efeitos; salvo no navegador) ----------
try{const v=JSON.parse(localStorage.getItem('vs_vol'));if(v&&typeof v.m==='number'&&typeof v.s==='number')VOL=v}catch(e){}
const SFXS=[[SFX,.35],[SWS,.4],[WSND,.3],[KSND,.3],[BSND,.35]];
function applyVol(){MUS.volume=Math.min(1,VOL.m/100);SFXS.forEach(([a,b])=>{a.volume=Math.min(1,b*VOL.s/50)});$('vmv').textContent=VOL.m+'%';$('vsv').textContent=VOL.s+'%';try{localStorage.setItem('vs_vol',JSON.stringify(VOL))}catch(e){}}
$('vm').value=VOL.m;$('vs').value=VOL.s;
$('vm').oninput=e=>{VOL.m=+e.target.value;applyVol()};$('vs').oninput=e=>{VOL.s=+e.target.value;applyVol()};$('vs').onchange=()=>sfxLevel();
$('optbtn').onclick=()=>{$('pausem').classList.remove('on');$('optm').classList.add('on')};$('optc').onclick=()=>{$('optm').classList.remove('on');$('pausem').classList.add('on')};
applyVol();
// ---------- versao para celular: deteccao e joystick virtual (so toque; mouse e teclado seguem normais) ----------
try{MOB=(typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches)||(typeof navigator!=='undefined'&&/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||''))}catch(e){}
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||JOY.on||!G||G.paused||G.pause||G.dead)return;JOY.seen=true;JOY.on=true;JOY.id=e.pointerId;JOY.ox=e.clientX;JOY.oy=e.clientY;JOY.x=JOY.y=JOY.kx=JOY.ky=0;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',e=>{if(!JOY.on||e.pointerId!==JOY.id)return;let dx=e.clientX-JOY.ox,dy=e.clientY-JOY.oy;const d=Math.hypot(dx,dy);if(d>JOY.R){dx*=JOY.R/d;dy*=JOY.R/d}JOY.kx=dx;JOY.ky=dy;JOY.x=dx/JOY.R;JOY.y=dy/JOY.R;if(Math.hypot(JOY.x,JOY.y)<.12){JOY.x=0;JOY.y=0}});
const jend=e=>{if(JOY.on&&(e.type==='pointercancel'||e.pointerId===JOY.id)){JOY.on=false;JOY.x=0;JOY.y=0}};
cv.addEventListener('pointerup',jend);cv.addEventListener('pointercancel',jend);
function drawJoy(){if(!MOB&&!JOY.seen)return;cx.save();const bx=JOY.on?JOY.ox:90,by=JOY.on?JOY.oy:H-110;
 cx.strokeStyle='#fff';cx.fillStyle='#fff';cx.lineWidth=3;cx.globalAlpha=JOY.on?.5:.2;cx.beginPath();cx.arc(bx,by,JOY.R,0,6.283);cx.stroke();
 cx.globalAlpha=JOY.on?.6:.25;cx.beginPath();cx.arc(bx+(JOY.on?JOY.kx:0),by+(JOY.on?JOY.ky:0),JOY.R*.45,0,6.283);cx.fill();cx.restore()}
// ---------- barra de vida minimalista (fica sempre embaixo do personagem) ----------
function drawHp(p){const C=CHARS[curChar],s=Math.max(.5,Math.max(1,Math.round(PX*Z*DPR))*(C.sc||1)),u=Math.max(1,Math.round(Math.max(1,Math.round(PX*Z*DPR))/2)),iw=30*u,ih=3*u,fw=Math.round(iw*Math.max(0,p.hp)/p.mhp),
 x=Math.round(W*DPR/2-iw/2-u),y=Math.round(H*DPR/2+(C.by-C.ay)*s+2*s);
 cx.save();cx.setTransform(1,0,0,1,0,0);
 cx.fillStyle='#120d1f';cx.fillRect(x,y,iw+2*u,ih+2*u);
 cx.fillStyle='#4a2432';cx.fillRect(x+u,y+u,iw,ih);
 if(fw>0){cx.fillStyle='#e5484d';cx.fillRect(x+u,y+u,fw,ih);cx.fillStyle='#ff8a8a';cx.fillRect(x+u,y+u,fw,u)}
 cx.restore()}
// ---------- mapas, Cidadela (procedural com o tileset Tiles.zip), personagens, mapa aberto ----------
let curMap='floresta';
const CY=new Map(),LOTS=new Map(),BSP=new Map();
['bg','rf','bw','wf','gb'].forEach(k=>{ATL[k]={img:new Image(),ok:false};ATL[k].img.onload=()=>{ATL[k].ok=true}});
for(const k in ATLU)ATL[k].img.src=ATLU[k];
const bv=(bx,by,i)=>Math.floor(hsh(bx,by,300+i)*HB.length),bh=(v,w)=>{const o=HB[v],a=o&&o.ok?o.img.naturalHeight/o.img.naturalWidth:1.1;return Math.max(3,Math.min(9,Math.round(w*a*.9)))};
function lotOf(bx,by){const key=bx+','+by;let L=LOTS.get(key);if(L)return L;
 const r=i=>hsh(bx,by,40+i),home=bx===0&&by===0,h=r(0);
 L={t:home?'E':h<.3?'A':h<.45?'B':h<.65?'C':h<.8?'D':'E',bl:[],gap:null,ring:false,tr:new Set(),path:new Set()};
 if(L.t==='A'){const w=6+Math.floor(r(1)*5),v=bv(bx,by,0),hh=bh(v,w);L.bl.push({x:1+Math.floor(r(3)*(13-w)),y:1+Math.floor(r(4)*(12-hh)),w,h:hh,s:r(5)<.5?0:1,v})}
 if(L.t==='B'){const w1=4+Math.floor(r(1)*2),w2=4+Math.floor(r(2)*2),v1=bv(bx,by,0),v2=bv(bx,by,1),h1=bh(v1,w1),h2=bh(v2,w2);
  L.bl.push({x:1,y:1+Math.floor(r(5)*(12-h1)),w:w1,h:h1,s:r(6)<.5?0:1,v:v1},{x:13-w2,y:1+Math.floor(r(7)*(12-h2)),w:w2,h:h2,s:r(8)<.5?0:1,v:v2})}
 if(L.t==='C'||L.t==='D'){L.ring=true;L.gap={side:L.t==='D'?2:Math.floor(r(1)*4),p:4+Math.floor(r(2)*4)}}
 if(L.t==='D'){const v=bv(bx,by,0);L.bl.push({x:4,y:3,w:6,h:bh(v,6),s:r(3)<.5?0:1,v})}
 for(const b of L.bl){const dx=b.x+Math.floor(b.w/2);for(let y=b.y+b.h;y<=12;y++)L.path.add(dx+','+y)}
 const lo=L.ring?2:1,hi=L.ring?11:12,cnt=home?0:L.t==='C'?8+Math.floor(r(9)*9):L.t==='D'?5+Math.floor(r(9)*5):L.t==='E'?5+Math.floor(r(9)*6):4+Math.floor(r(9)*5);
 const inB=(x,y)=>L.bl.some(b=>x>=b.x-1&&x<b.x+b.w+1&&y>=b.y-1&&y<b.y+b.h+1);
 const inCor=(x,y)=>{if(!L.gap)return false;const g=L.gap,qx=x>=g.p-1&&x<=g.p+2,qy=y>=g.p-1&&y<=g.p+2;return g.side===0?(qx&&y<=6):g.side===2?(qx&&y>=7):g.side===1?(qy&&x>=7):(qy&&x<=6)};
 for(let k=0;k<cnt*5&&L.tr.size<cnt;k++){const x=lo+Math.floor(hsh(bx,by,200+k*2)*(hi-lo+1)),y=lo+Math.floor(hsh(bx,by,201+k*2)*(hi-lo+1));
  if(!inB(x,y)&&!inCor(x,y)&&!L.path.has(x+','+y))L.tr.add(x+','+y)}
 LOTS.set(key,L);return L}
function bldOf(bx,by,i,b){const key=bx+','+by+','+i;let o=BSP.get(key);if(!o){o={x0:bx*18-6+b.x,y0:by*18-6+b.y,w:b.w,h:b.h,s:b.s,v:b.v};BSP.set(key,o)}return o}
function TY(tx,ty){const k=(tx+32768)*65536+(ty+32768);let t=CY.get(k);if(t)return t;if(CY.size>80000)CY.clear();
 const X=tx+6,Y=ty+6,bx=Math.floor(X/18),by=Math.floor(Y/18),lx=X-bx*18,ly=Y-by*18,hv=hsh(tx,ty,3);
 t={k:'g',w:false,g:Math.floor(hv*4),top:null,bd:null,lx,ly};
 if(lx>=14||ly>=14){t.k='r';t.g=Math.floor(hv*3);if(hsh(tx,ty,23)<.06&&(Math.abs(tx)>5||Math.abs(ty)>5)){t.w=true;t.top={a:'gb',c:GBC[Math.floor(hsh(tx,ty,9)*GBC.length)]}}}
 else if(lx===0||lx===13||ly===0||ly===13){t.k='s';t.g=Math.floor(hv*3)}
 else{const L=lotOf(bx,by),key=lx+','+ly;if(L.t==='E')t.k='a';
  let bi=-1;for(let i=0;i<L.bl.length;i++){const b=L.bl[i];if(lx>=b.x&&lx<b.x+b.w&&ly>=b.y&&ly<b.y+b.h){bi=i;break}}
  if(bi>=0){t.k='b';t.w=true;t.bd=bldOf(bx,by,bi,L.bl[bi])}
  else if(L.ring&&(lx===1||lx===12||ly===1||ly===12)){const g=L.gap,gp=(g.side===0&&ly===1||g.side===2&&ly===12)?(lx===g.p||lx===g.p+1):(g.side===1&&lx===12||g.side===3&&lx===1)?(ly===g.p||ly===g.p+1):false,brick=L.t==='D',horiz=ly===1||ly===12;
   if(gp){t.k='e';if(!brick&&horiz)t.top={a:'wf',c:[1,2]}}
   else{t.w=true;t.k=brick?'m':'f';t.top=brick?{a:'bw',c:horiz?[4,2]:lx===1?[0,1]:[5,1]}:{a:'wf',c:horiz?[1,1]:lx===1?[0,1]:[4,1]}}}
  else if(L.tr.has(key)){t.w=true;t.k='t';t.top={a:'gb',c:GBC[Math.floor(hsh(tx,ty,9)*GBC.length)]}}
  else if(L.path.has(key))t.k='p'}
 CY.set(k,t);return t}
function cellAt(k,c,x,y){const A=ATL[k];if(A.ok){cx.imageSmoothingEnabled=false;cx.drawImage(A.img,c[0]*16,c[1]*16,16,16,x,y,TS+1,TS+1)}}
function bdSprite(b){if(b.cv)return b.cv;if(!ATL.rf.ok)return null;const c=document.createElement('canvas');c.width=b.w*16;c.height=b.h*16;const g=c.getContext('2d'),R=ATL.rf.img,o=b.s?8:0;
 for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){const sx=(x===0?0:x===b.w-1?2:1)+o,sy=y===0?0:y===b.h-1?4:[1,2,3][(y-1)%3];g.drawImage(R,sx*16,sy*16,16,16,x*16,y*16,16,16)}
 const dx=Math.floor(b.w/2)*16+2,dy=(b.h-1)*16+2;g.fillStyle='#1b1626';g.fillRect(dx,dy,12,13);g.fillStyle='#5a5470';g.fillRect(dx+1,dy+1,10,2);g.fillStyle='#2f2840';g.fillRect(dx+2,dy+4,8,9);g.fillStyle='#8a84a0';g.fillRect(dx+8,dy+8,1,2);
 b.cv=c;return c}
function drawCity(){const p=G.p,x0=Math.floor((p.x-W/2/Z)/TS)-1,x1=Math.ceil((p.x+W/2/Z)/TS)+1,y0=Math.floor((p.y-H/2/Z)/TS)-1,y1=Math.ceil((p.y+H/2/Z)/TS)+1,seen=new Set();
 cx.fillStyle='#4b4658';cx.fillRect(x0*TS,y0*TS,(x1-x0+1)*TS,(y1-y0+1)*TS);
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const t=T(tx,ty),x=tx*TS,y=ty*TS;
  if(t.k==='r')cellAt('bg',ASP[t.g%3],x,y);else if(t.k==='s'||t.k==='p')cellAt('bg',SW[t.g%3],x,y);else if(t.k==='a')cellAt('bg',ASP[t.g%3],x,y);else cellAt('bg',GR[t.g%4],x,y);
  if(t.top)cellAt(t.top.a,t.top.c,x,y);
  if(t.k==='r'){cx.fillStyle='#d8d2a8';if(t.ly===15&&t.lx<14&&(tx&1))cx.fillRect(x,y+TS-2,TS,3);if(t.lx===15&&t.ly<14&&(ty&1))cx.fillRect(x+TS-2,y,3,TS)}
  if(t.bd)seen.add(t.bd)}
 for(const b of seen){const o=HB[b.v||0];if(o&&o.ok){const iw=o.img.naturalWidth,ih=o.img.naturalHeight,k=b.w*TS/iw,dw=iw*k,dh=ih*k;cx.imageSmoothingEnabled=true;cx.drawImage(o.img,Math.round(b.x0*TS+(b.w*TS-dw)/2),Math.round((b.y0+b.h)*TS-dh),Math.round(dw),Math.round(dh));cx.imageSmoothingEnabled=false;continue}const sp=bdSprite(b);if(sp){cx.imageSmoothingEnabled=false;cx.drawImage(sp,b.x0*TS,b.y0*TS,b.w*TS,b.h*TS)}}}
// zumbis (sprites de caminhada; so os 4 sentidos)
for(const kd in ZU){ZS[kd]={};for(const d in ZU[kd]){const o={img:new Image(),ok:false};o.img.onload=()=>{o.ok=true};o.img.src=ZU[kd][d];ZS[kd][d]=o}}
function zombieSpr(e,tint){const kd=e.boss?'axe':e.r>10?'big':'small',a=Math.atan2(G.p.y-e.y,G.p.x-e.x),cs=Math.cos(a),sn=Math.sin(a),d=Math.abs(cs)>Math.abs(sn)?(cs>0?'right':'left'):(sn>0?'down':'up'),o=ZS[kd][d];
 if(!o.ok){cx.fillStyle=e.c;cx.beginPath();cx.arc(e.x,e.y,e.r,0,6.283);cx.fill();return}
 if(e.ph===undefined)e.ph=Math.random()*8;const N=ZN[kd],k=ZK[kd],fw=o.img.naturalWidth/N,fh=o.img.naturalHeight,f=Math.floor(G.t*8+e.ph)%N,dw=fw*k,dh=fh*k;
 cx.imageSmoothingEnabled=false;cx.drawImage(o.img,f*fw,0,fw,fh,Math.round(e.x-dw/2),Math.round(e.y+e.r*.6-dh),dw,dh);
 if(tint){cx.globalAlpha=.45;cx.fillStyle=tint;cx.beginPath();cx.arc(e.x,e.y-e.r*.2,e.r*.8,0,6.283);cx.fill();cx.globalAlpha=1}}
// personagens e desbloqueio
function unlocked(id){const c=CHARS[id];return !c.locked||!!(meta.un&&meta.un[id])}
function unlockChar(id){meta.un=meta.un||{};meta.un[id]=1;save();toast('Personagem desbloqueado: '+CHARS[id].name+'!')}
function spawnNpcs(){G.NPC=[];for(const id in CHARS){const c=CHARS[id];if(c.locked&&!unlocked(id)&&c.unlock&&c.unlock.map===curMap&&Math.random()<c.unlock.chance){
  for(let t=0;t<40;t++){const a=Math.random()*6.283,d=c.unlock.minD+Math.random()*(c.unlock.maxD-c.unlock.minD),sp=freeSpot(Math.cos(a)*d,Math.sin(a)*d,16),dd=Math.hypot(sp.x,sp.y);if(dd>=c.unlock.minD&&dd<=c.unlock.maxD&&!blk(sp.x,sp.y,16)&&(curMap!=='cidadela'||'rsp'.includes(T(Math.floor(sp.x/TS),Math.floor(sp.y/TS)).k))){G.NPC.push({id,x:sp.x,y:sp.y});break}}}}}
function drawNpc(n){const c=CHARS[n.id];if(!c.ok)return;const k=2*(c.sc||1),bob=Math.sin(G.t*4)*2;cx.fillStyle='#0005';cx.fillRect(Math.round(n.x-10*k),Math.round(n.y+(c.by-c.ay-1)*k),20*k,k);
 cx.imageSmoothingEnabled=false;cx.drawImage(c.img,c.idle*c.fw,0,c.fw,c.fh,Math.round(n.x-c.ax*k),Math.round(n.y-c.ay*k),c.fw*k,c.fh*k);
 cx.fillStyle='#f5c542';cx.fillRect(Math.round(n.x-3),Math.round(n.y-c.ay*k-14+bob),6,6);cx.fillRect(Math.round(n.x-1),Math.round(n.y-c.ay*k-20+bob),2,5)}
function buildChars(){const b=$('chars');b.textContent='';for(const id in CHARS){const c=CHARS[id],ok=unlocked(id),el=document.createElement('button'),cv2=document.createElement('canvas');el.className='card';cv2.width=cv2.height=32;
  const g=cv2.getContext('2d');g.imageSmoothingEnabled=false;if(c.ok)g.drawImage(c.img,c.idle*c.fw,0,c.fw,c.fh,0,0,32,32);if(!ok)cv2.style.filter='brightness(0) opacity(.5)';
  const nm=document.createElement('b'),sm=document.createElement('small'),st=document.createElement('small');nm.textContent=ok?c.name:'???';sm.textContent=ok?'Arma inicial: '+ITEMS[c.start].n:c.hint;st.textContent=id===curChar?'[ SELECIONADO ]':'';
  el.append(cv2,nm,sm,st);if(id===curChar)el.style.boxShadow='0 0 0 3px var(--ac)';
  el.onclick=()=>{if(!ok)return;curChar=id;meta.ch=id;save();$('chr').textContent=c.name;buildChars()};b.appendChild(el)}}
function buildMaps(){const b=$('maps');b.textContent='';for(const id in MAPS){const m=MAPS[id],el=document.createElement('button'),nm=document.createElement('b'),ds=document.createElement('small');el.className='card';nm.textContent=m.name;ds.textContent=m.desc;el.append(nm,ds);
  el.onclick=()=>{curMap=id;$('mapm').classList.remove('on');newGame()};b.appendChild(el)}}
// mapa aberto (J): jogo pausado enquanto aberto
function mapColor(tx,ty){const t=T(tx,ty);
 if(curMap==='cidadela')return t.bd?(t.bd.s?'#8a3a3a':'#6a6a80'):({r:'#4b4658',a:'#5a5568',s:'#b9a398',p:'#b9a398',g:'#6f9c5e',e:'#6f9c5e',m:'#9b3f3f',f:'#8b9a9a',t:'#6d5f58'})[t.k]||'#6f9c5e';
 if(t.w)return '#3f8fc0';if(t.o)return t.o.s.h===46?'#2e6b34':'#9a977f';return t.v?'#7fb058':'#86b85f'}
function openMap(){if(!G||G.dead||G.pause||G.paused||G.mapOpen)return;G.mapOpen=true;const R=128,px=4,c=$('mapcv');c.width=c.height=R*2*px;const g=c.getContext('2d'),ptx=Math.floor(G.p.x/TS),pty=Math.floor(G.p.y/TS);
 for(let j=-R;j<R;j++)for(let i=-R;i<R;i++){g.fillStyle=mapColor(ptx+i,pty+j);g.fillRect((i+R)*px,(j+R)*px,px,px)}
 const S=R*2*px;(G.NPC||[]).forEach(n=>{let mx=(n.x/TS-ptx+R)*px,my=(n.y/TS-pty+R)*px;mx=Math.max(24,Math.min(S-24,mx));my=Math.max(24,Math.min(S-24,my));
  g.fillStyle='#000';g.beginPath();g.moveTo(mx,my-20);g.lineTo(mx+16,my);g.lineTo(mx,my+20);g.lineTo(mx-16,my);g.fill();g.fillStyle='#f5c542';g.beginPath();g.moveTo(mx,my-15);g.lineTo(mx+11,my);g.lineTo(mx,my+15);g.lineTo(mx-11,my);g.fill();
  g.font='bold 26px monospace';const lx=Math.min(mx+20,S-210);g.fillStyle='#000';g.fillText(CHARS[n.id].name,lx+2,my-12+2);g.fillStyle='#fff';g.fillText(CHARS[n.id].name,lx,my-12)});
 g.fillStyle='#fff';g.beginPath();g.arc(S/2,S/2,13,0,6.283);g.fill();g.fillStyle='#e5484d';g.beginPath();g.arc(S/2,S/2,8,0,6.283);g.fill();
 g.font='bold 26px monospace';g.fillStyle='#000';g.fillText('Você',S/2+22,S/2+9);g.fillStyle='#fff';g.fillText('Você',S/2+20,S/2+7);
 $('mapv').classList.add('on')}
function closeMap(){if(!G)return;G.mapOpen=false;$('mapv').classList.remove('on')}
// ---------- fusao de gemas: 100 gemas do mesmo tipo viram 1 gema de cor distinta com o XP somado ----------
[['gem','gemf0',(r,g,b)=>[b,g,r]],['gemg','gemf1',(r,g,b)=>[Math.min(255,g+30),Math.round(g*.85),Math.round(r*.3)]],['gemp','gemf2',(r,g,b)=>[Math.min(255,r*.4+160),Math.min(255,g*.4+160),Math.min(255,b*.4+160)]]].forEach(([src,dst,fn])=>{
 IC[dst]={img:IC[src].img,ok:false};const I=IC[src].img;
 const mk=()=>{try{const c=document.createElement('canvas');c.width=I.naturalWidth;c.height=I.naturalHeight;const g=c.getContext('2d');g.drawImage(I,0,0);const d=g.getImageData(0,0,c.width,c.height),a=d.data;
  for(let i=0;i<a.length;i+=4){if(a[i+3]){const q=fn(a[i],a[i+1],a[i+2]);a[i]=q[0];a[i+1]=q[1];a[i+2]=q[2]}}g.putImageData(d,0,0);IC[dst]={img:c,ok:true}}catch(e){}};
 if(I.complete&&I.naturalWidth)mk();else if(typeof I.addEventListener==='function')I.addEventListener('load',mk)});
function fuseGems(){const g=G.O;if(g.length<100)return;const n=[0,0,0];for(const o of g){const k=o.k||0;if(k<3)n[k]++}
 for(let k=0;k<3;k++){if(n[k]<100)continue;let sx=0,sy=0,sv=0,c=0,att=false;const rest=[];
  for(const o of G.O){if((o.k||0)===k){sx+=o.x;sy+=o.y;sv+=o.v||1;c++;if(o.g)att=true}else rest.push(o)}
  const f=freeSpot(sx/c,sy/c,8),ng={x:f.x,y:f.y,k:k+3,v:sv};if(att)ng.g=1;rest.push(ng);G.O=rest}}
// ---------- estado ----------
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;if(e.key==='Escape'&&G&&G.mapOpen){closeMap();return}if(e.key.toLowerCase()==='j'&&!e.repeat&&G&&!G.dead&&!G.pause&&!G.paused){G.mapOpen?closeMap():openMap();return}if(e.key.toLowerCase()==='m'&&!e.repeat)MUS.muted=SFX.muted=SWS.muted=WSND.muted=KSND.muted=BSND.muted=!MUS.muted;if((e.key==='Escape'||e.key.toLowerCase()==='p')&&G&&!G.dead&&!G.pause){if($('optm').classList.contains('on')){$('optm').classList.remove('on');$('pausem').classList.add('on')}else togglePause()}if(G&&G.pause&&'1234'.includes(e.key))pick(+e.key-1)});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function newGame(){musicOn();$('pbtn').style.display=MOB?'block':'none';$('mapbtn').style.display=MOB?'block':'none';SEED=(Math.random()*2147483647)|0;TC.clear();CY.clear();LOTS.clear();BSP.clear();
 G={t:0,p:{x:0,y:0,hp:100+20*ml('hp'),mhp:100+20*ml('hp'),r:12,inv:0,xp:0,lv:1,face:1},
  inv:{[CHARS[curChar].start]:1},cd:{},E:[],P:[],O:[],C:[],B:[],CH:[],FX:[],kills:0,coins:0,acc:0,bossN:0,pause:false,dead:false,orbA:0,auraT:0,msg:'',msgT:0,choices:[]};
 $('menu').classList.remove('on');$('over').classList.remove('on');
 spawnNpcs();if(!running){running=true;last=performance.now();requestAnimationFrame(loop)}}
const L=i=>G.inv[i]||0;
const mul=()=>({dmg:(1+.15*L('might'))*(1+.08*ml('dmg')),spd:(1+.1*L('speed'))*(1+.05*ml('spd')),cd:Math.pow(.92,L('haste'))*(1-.04*ml('cd')),area:1+.12*L('area'),dur:1+.15*L('dur'),f:{d:1+(L('steel')>=1?.25:0),n:L('steel')>=2?2:0,pen:L('steel')>=3,a:1+(L('steel')>=4?.3:0)},g:{d:1+(L('tome')>=1?.25:0),n:L('tome')>=2?2:0,a:1+(L('tome')>=4?.3:0)},e:{d:1+(L('dynamo')>=1?.25:0),n:L('dynamo')>=2?2:0,cd:L('dynamo')>=4?.85:1},mag:(1+.3*L('magnet'))*(1+.15*ml('mag')),xp:(1+.1*L('growth'))*(1+.08*ml('xp'))});
const need=l=>Math.floor(5+l*l*1.2+l*3);
function nearest(x,y,n=1,maxd=700){return G.E.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<maxd).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).slice(0,n)}
function hurt(e,d,t,x){if(e.vul>0)d*=1.25;e.hp-=d;e.lastType=t;e.fl=.08;hitFx(e,t);
 if(t==='eletrico'&&L('dynamo')>=3)e.vul=4;
 if(x){if(t==='magico'){const M=L('tome');if(M>=3&&Math.random()<.2)e.st=1;
  if(M>=5&&Math.random()<.1){G.FX.push({x:e.x,y:e.y,t:.3,r:50,c:'#b57bff',nb:1});G.E.forEach(o=>{if(o!==e&&!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<50+o.r)hurt(o,d*.6,'magico')})}}
  if(t==='eletrico'&&L('dynamo')>=5&&Math.random()<.1)nearest(e.x,e.y,3,170).filter(o=>o!==e).slice(0,2).forEach(o=>{hurt(o,d*.7,'eletrico');sfxBolt();G.FX.push({x:o.x,y:o.y,t:.2,d:.2,sp:'bolt',r:18,c:'#f9e34b'})})}
 if(e.hp<=0&&!e.dead){e.dead=true;G.kills++;
 const xk=e.boss?2:e.r>10?1:0;if(e.boss){const fc=freeSpot(e.x,e.y,16);G.CH.push({x:fc.x,y:fc.y})}const fo=freeSpot(e.x+(e.boss?26:0),e.y,6);G.O.push({x:fo.x,y:fo.y,k:xk,v:[1,3,15][xk]});}}
function fire(id,dt,m){const l=L(id);if(!l)return;
 if(id==='wand'||id==='knife'||id==='bolt'){
  G.cd[id]=(G.cd[id]||0)-dt;if(G.cd[id]>0)return;const p=G.p;
  if(id==='wand'){G.cd[id]=(1-.08*l)*m.cd;const t=nearest(p.x,p.y,1+(l>=3)+(l>=5)+m.g.n);if(!t.length)return;sfxWand();
   t.forEach(e=>{const a=Math.atan2(e.y-p.y,e.x-p.x);G.P.push({x:p.x,y:p.y,vx:Math.cos(a)*320,vy:Math.sin(a)*320,d:(10+5*l)*m.dmg*m.g.d,pr:1,r:6*m.area*m.g.a,life:2,h:[],c:'#b57bff',t:'magico',sp:'wand'})})}
  if(id==='knife'){G.cd[id]=(.7-.06*l)*m.cd;const t=nearest(p.x,p.y,1);if(!t.length)return;sfxKnife();
   const n=1+Math.floor(l/2)+m.f.n;for(let i=0;i<n;i++){const a=Math.atan2(t[0].y-p.y,t[0].x-p.x)+(i-(n-1)/2)*.15;
    G.P.push({x:p.x,y:p.y,vx:Math.cos(a)*520,vy:Math.sin(a)*520,d:(8+3*l)*m.dmg*m.f.d,pr:m.f.pen?999:1,r:5*m.area*m.f.a,life:1.2,h:[],c:'#dfe6e9',t:'fisico',sp:'knife'})}}
  if(id==='bolt'){G.cd[id]=(2-.2*l)*m.cd*m.e.cd;const t=nearest(p.x,p.y,l+1+m.e.n,450);t.forEach(e=>{hurt(e,(25+9*l)*m.dmg*m.e.d,'eletrico',1);sfxBolt();G.FX.push({x:e.x,y:e.y,t:.25,d:.25,sp:'bolt',r:30*m.area,c:'#f9e34b'})})}
 }
 if(id==='axe'){G.cd.axe=(G.cd.axe||0)-dt;if(G.cd.axe<=0){G.cd.axe=(1.6-.1*l)*m.cd;sfxAxe();const n=1+Math.floor(l/2)+m.f.n;for(let i=0;i<n;i++)G.P.push({x:G.p.x,y:G.p.y,vx:(Math.random()-.5)*220,vy:-380,g:700,d:(14+5*l)*m.dmg*m.f.d,pr:m.f.pen?999:99,r:10*m.area*m.f.a,life:2.2,h:[],c:'#ff9800',t:'fisico',sp:'axe'})}}
 if(id==='aura'){G.auraT-=dt;if(G.auraT<=0){G.auraT=.5*m.cd;const r=(45+13*l)*m.area*m.g.a;
  G.E.forEach(e=>{if(!e.dead&&Math.hypot(e.x-G.p.x,e.y-G.p.y)<r+e.r)hurt(e,(5+3*l)*m.dmg*m.g.d,'magico')})}}
 if(id==='orb'){G.orbT=(G.orbT||0)+dt;const on=(2.5+.5*l)*m.dur,off=3*m.cd;const ph=G.orbT%(on+off);G.orbOn=ph<on;G.orbPh=ph;G.orbDur=on;if(!G.orbOn)return;const n=l+1+m.g.n,r=75*m.area;G.orbA+=dt*(2+.3*l);
  for(let i=0;i<n;i++){const a=G.orbA+i*6.283/n,ox=G.p.x+Math.cos(a)*r,oy=G.p.y+Math.sin(a)*r;
   G.E.forEach(e=>{if(!e.dead&&Math.hypot(e.x-ox,e.y-oy)<e.r+9*m.area*m.g.a&&(!e.oh||e.oh<G.t)){hurt(e,(8+3*l)*m.dmg*m.g.d,'magico',1);e.oh=G.t+.4}})}}}
function hpTier(t){return Math.pow(3,Math.floor(t/600))}
function spawn(){const p=G.p,a=Math.random()*6.283,d=vr()+40,t=G.t,sx=p.x+Math.cos(a)*d,sy=p.y+Math.sin(a)*d;
 if(blk(sx,sy,12))return;
 if(t>=1800){if(G.E.reduce((n,e)=>n+(e.boss?1:0),0)>=14)return;const k=Math.floor(t/300);
  G.E.push({x:sx,y:sy,hp:(3000*k*k+1800)*hpTier(t),sp:60+Math.min((t-1800)*.02,40),r:34,dmg:18*(1+t/300),c:'#8e1b5e',boss:1,fl:0});return}
 const hp=(4+t*.1)*hpTier(t),sp=45+Math.min(t*.15,110)+Math.random()*15,big=t>=600||Math.random()<Math.min(.3,t/900),dm=1+t/300;
 G.E.push({x:sx,y:sy,hp:big?hp*3:hp,sp:big?sp*.8:sp,r:big?16:10,dmg:(big?10:6)*dm,c:big?'#c0392b':`hsl(${100+Math.random()*40},50%,40%)`,fl:0})}
function spawnBoss(){G.bossN++;const p=G.p,a=Math.random()*6.283,k=G.bossN;
 G.E.push({x:p.x+Math.cos(a)*(vr()+80),y:p.y+Math.sin(a)*(vr()+80),hp:(3000*k*k+1800)*hpTier(G.t),sp:60,r:34,dmg:18*(1+G.t/300),c:'#8e1b5e',boss:1,fl:0});toast('⚠ UM BOSS APARECEU!')}
function toast(s){G.msg=s;G.msgT=3}
const UT={wand:l=>`+5 dano, recarga menor${l==3||l==5?', +1 projétil':''}`,knife:l=>`+3 dano, recarga menor${l%2==0?', +1 faca':''}`,orb:l=>'+1 orbe, +3 dano, giro mais rápido, +0,5s de duração',aura:l=>'+13 de raio, +3 dano',bolt:l=>'+1 raio, +9 dano, recarga menor',axe:l=>`+5 dano, recarga menor${l%2==0?', +1 machado':''}`};
UT.steel=l=>['','+25% de dano físico','+2 projéteis físicos','Projéteis físicos atravessam todos os inimigos','+30% de área dos projéteis físicos','10% de chance de duplicar o projétil em outra direção ao acertar'][l];
UT.tome=l=>['','+25% de dano mágico','+2 projéteis mágicos (varinha e orbes)','Chance de atordoar inimigos atingidos','+30% de área dos ataques mágicos','10% de chance de explodir o inimigo ao acertar'][l];
UT.dynamo=l=>['','+25% de dano elétrico','+2 de quantidade nas armas elétricas','Inimigos atingidos ficam vulneráveis (+25% de dano recebido)','Armas elétricas recarregam 15% mais rápido','10% de chance do raio saltar para até 2 inimigos próximos'][l];
const upText=(k,l)=>UT[k](l);
const cnt=t=>Object.keys(G.inv).filter(k=>ITEMS[k].k===t).length;
function levelUp(){sfxLevel();const pool=Object.keys(ITEMS).filter(k=>L(k)<MAXL&&(L(k)>0||cnt(ITEMS[k].k)<6));
 G.choices=pool.sort(()=>Math.random()-.5).slice(0,Math.random()<.05+.05*ml('luck')?4:3);if(!G.choices.length){G.p.hp=G.p.mhp;G.coins+=10;toast('Tudo no máximo! +10 moedas');return}
 G.pause=true;const o=$('opts');o.innerHTML='';
 G.choices.forEach((k,i)=>{const it=ITEMS[k],b=document.createElement('button');b.className='card';
  b.innerHTML=`<span class="tag ${it.k==='p'?'p':''}">${it.k==='w'?'ARMA':'PASSIVO'}</span><b>${it.n}</b>${it.dt?`<small>Dano ${DT[it.dt]}</small>`:''}<small>${UT[k]&&(L(k)||it.k==='p')?upText(k,L(k)+1):it.d}</small><span>${L(k)?'Nv '+L(k)+' → '+(L(k)+1):'NOVO'}</span>`;
  b.onclick=()=>pick(i);o.appendChild(b)});$('lvl').classList.add('on')}
function give(k){G.inv[k]=L(k)+1;if(k==='hp'){G.p.mhp+=25;G.p.hp+=25}}
function pick(i){const k=G.choices[i];if(!k)return;give(k);$('lvl').classList.remove('on');G.pause=false;
 if(G.p.xp>=need(G.p.lv)){G.p.xp-=need(G.p.lv);G.p.lv++;levelUp()}}
function chest(){const o=Object.keys(G.inv).filter(k=>L(k)<MAXL);
 if(!o.length){G.p.hp=G.p.mhp;toast('Baú: vida restaurada!');return}
 const k=o[Math.floor(Math.random()*o.length)];give(k);toast(`Baú: ${ITEMS[k].n} subiu para Nv ${L(k)}!`)}
function update(dt){const p=G.p,m=mul();G.t+=dt;
 let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
 let jm=1;if(JOY.on){dx=JOY.x;dy=JOY.y;jm=Math.min(1,Math.hypot(dx,dy))}
 const n=Math.hypot(dx,dy)||1;mvE(p,dx/n*140*m.spd*dt*jm,dy/n*140*m.spd*dt*jm,10);if(dx)p.face=dx;p.mv=dx||dy;if(dx||dy)p.dir=Math.abs(dx)>=Math.abs(dy)?(dx>0?2:1):(dy>0?0:3);
 p.hp=Math.min(p.mhp,p.hp+.6*L('regen')*dt);p.inv-=dt;
 // spawns
 G.acc+=dt*(1+G.t/30);let c=0;while(G.acc>=1&&c++<8){G.acc--;if(G.E.length<450)spawn()}
 if(G.t>=300*(G.bossN+1))spawnBoss();
 for(let bt=0;G.B.length<10&&bt<12;bt++){const a=Math.random()*6.283,d=250+Math.random()*450;{const bx=p.x+Math.cos(a)*d,by=p.y+Math.sin(a)*d;if(!blk(bx,by,16))G.B.push({x:bx,y:by,hp:15,v:Math.floor(Math.random()*CB.length)})}}
 G.B=G.B.filter(b=>Math.hypot(b.x-p.x,b.y-p.y)<1100||(b.far=1,false)||true).filter(b=>Math.hypot(b.x-p.x,b.y-p.y)<1100);
 for(const id in G.inv)fire(id,dt,m);
 // projéteis
 G.P.forEach(q=>{q.vy+=(q.g||0)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;
  for(const e of G.E){if(e.dead||q.h.includes(e))continue;if(Math.hypot(e.x-q.x,e.y-q.y)<e.r+q.r){hurt(e,q.d,q.t,1);q.h.push(e);if(q.t==='fisico'&&!q.cl&&L('steel')>=5&&Math.random()<.1){const a=Math.random()*6.283,sp=Math.hypot(q.vx,q.vy);G.P.push({...q,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,h:[e],cl:1})}if(--q.pr<=0){q.life=0;break}}}
  if(q.life>0)for(const b of G.B){if(b.hp>0&&!q.h.includes(b)&&Math.hypot(b.x-q.x,b.y-q.y)<18+q.r){b.hp-=q.d;q.h.push(b);if(--q.pr<=0){q.life=0;break}}}});
 G.P=G.P.filter(q=>q.life>0);
 // caixas (também danificadas por aura/orbes/raios de forma simples)
 const ar=(45+13*L('aura'))*m.area*m.g.a;
 G.B.forEach(b=>{if(L('aura')&&Math.hypot(b.x-p.x,b.y-p.y)<ar+14)b.hp-=8*dt*m.dmg;
  if(L('orb')&&G.orbOn){const r=75*m.area,nn=L('orb')+1+m.g.n;for(let i=0;i<nn;i++){const a=G.orbA+i*6.283/nn;if(Math.hypot(b.x-(p.x+Math.cos(a)*r),b.y-(p.y+Math.sin(a)*r))<22)b.hp-=30*dt}}
  if(b.hp<=0&&!b.done){b.done=1;const n=Math.random()<.45?(Math.random()<.2?2:1):0;for(let i=0;i<n;i++)G.C.push({x:b.x+(Math.random()-.5)*20,y:b.y+(Math.random()-.5)*20});if(Math.random()<.2){const r=Math.random(),lk=.05+.05*ml('luck')+.05*L('luck');(G.IT||(G.IT=[])).push({x:b.x,y:b.y,k:r<.5?'heart':r<.57?'nuke':r<.57+.1*(1+lk)?'magnet':'root'})}}});
 G.B=G.B.filter(b=>!b.done);
 // inimigos
 G.E.forEach(e=>{const a=Math.atan2(p.y-e.y,p.x-e.x);if(e.st>0)e.st-=dt;else if(e.rt>0)e.rt-=dt;else mvE(e,Math.cos(a)*e.sp*dt,Math.sin(a)*e.sp*dt,e.r*.6);e.vul-=dt;e.fl-=dt;
  if(Math.hypot(p.x-e.x,p.y-e.y)<p.r+e.r&&p.inv<=0){p.hp-=e.dmg;p.inv=.5;if(p.hp<=0)die()}});
 const gr=new Map(),cs=56;
 for(const e of G.E){if(e.dead)continue;const k=Math.floor(e.x/cs)*100003+Math.floor(e.y/cs),a=gr.get(k);if(a)a.push(e);else gr.set(k,[e])}
 for(const e of G.E){if(e.dead)continue;const gx=Math.floor(e.x/cs),gy=Math.floor(e.y/cs);
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=gr.get((gx+i)*100003+gy+j);if(!a)continue;
   for(const o of a){if(o===e)continue;const dx=e.x-o.x,dy=e.y-o.y,mn=e.r+o.r,d2=dx*dx+dy*dy;if(d2<mn*mn&&d2>.01){const d=Math.sqrt(d2),f=(mn-d)*o.r/mn;e.x+=dx/d*f;e.y+=dy/d*f}}}}
 G.E=G.E.filter(e=>!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<vr()+700);
 // coleta
 const mr=70*m.mag;
 G.O=G.O.filter(o=>{const d=Math.hypot(p.x-o.x,p.y-o.y);if(d<mr||o.g){o.g=1;o.x+=(p.x-o.x)/d*380*dt;o.y+=(p.y-o.y)/d*380*dt}
  if(d<p.r+6){p.xp+=m.xp*(o.v||1);if(p.xp>=need(p.lv)&&!G.pause){p.xp-=need(p.lv);p.lv++;levelUp()}return false}return true});
 fuseGems();G.C=G.C.filter(o=>{const d=Math.hypot(p.x-o.x,p.y-o.y);if(d<mr){o.x+=(p.x-o.x)/d*380*dt;o.y+=(p.y-o.y)/d*380*dt}
  if(d<p.r+6){G.coins++;return false}return true});
 if(G.NPC)G.NPC=G.NPC.filter(n=>{if(Math.hypot(p.x-n.x,p.y-n.y)<p.r+20){unlockChar(n.id);return false}return true});
 if(G.IT)G.IT=G.IT.filter(o=>{if(Math.hypot(p.x-o.x,p.y-o.y)<p.r+16){useItem(o.k);return false}return true});
 G.CH=G.CH.filter(o=>{if(Math.hypot(p.x-o.x,p.y-o.y)<p.r+16){chest();return false}return true});
 if(G.HP){for(const q of G.HP){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.9;q.vy*=.9;q.l-=dt}G.HP=G.HP.filter(q=>q.l>0)}G.fl-=dt;G.FX.forEach(f=>f.t-=dt);G.FX=G.FX.filter(f=>f.t>0);G.msgT-=dt}
function die(){G.dead=true;musicOff();$('pbtn').style.display='none';$('mapbtn').style.display='none';lbSubmit(G.kills,G.t);meta.coins+=G.coins;save();
 const t=Math.floor(G.t);$('stats').innerHTML=`Tempo: ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')} · Nível ${G.p.lv} · Abates: ${G.kills}<br>Moedas ganhas: ${G.coins} 🪙`;$('over').classList.add('on')}
function draw(){cx.setTransform(DPR,0,0,DPR,0,0);const p=G.p,ox=W/2-p.x*Z,oy=H/2-p.y*Z;cx.fillStyle='#1b1626';cx.fillRect(0,0,W,H);
 cx.save();cx.translate(ox,oy);cx.scale(Z,Z);drawGround();cx.restore();
 cx.save();cx.translate(ox,oy);cx.scale(Z,Z);const m=mul();drawObs(0);
 const circ=(x,y,r,c)=>{cx.fillStyle=c;cx.beginPath();cx.arc(x,y,r,0,6.283);cx.fill()};
 G.B.forEach(b=>curMap==='cidadela'?cityBox(b):chestSpr('wood',b.x,b.y,'#8d6e3f',24,24));
 G.C.forEach(o=>icon('coin',o.x,o.y,'#f5c542',5));G.O.forEach(o=>{const k=o.k||0;icon(GK[k],o.x,o.y,GF[k],k>2?7:4,k>2?24:16)});
 G.CH.forEach(o=>chestSpr('gold',o.x,o.y,'#e67e22',32,24));
 (G.NPC||[]).forEach(drawNpc);
 (G.IT||[]).forEach(o=>icon(o.k==='root'?'roots':o.k,o.x,o.y-10+Math.sin(G.t*4+o.x)*3,'#fff',8,32));
 if(L('aura')){cx.globalAlpha=.25;circ(p.x,p.y,(45+13*L('aura'))*m.area*m.g.a,'#8e44ad');cx.globalAlpha=1}
 G.E.forEach(e=>{const tint=e.fl>0?'#fff':e.st>0?'#7fb3ff':e.rt>0?'#a0764a':e.vul>0?'#ffe97a':null;if(curMap==='cidadela'){zombieSpr(e,tint);return}if(!e.boss&&e.r<=10&&SL.ok){slime(e,tint);return}if(!e.boss&&e.r>10&&SL2.ok){slime(e,tint,SL2,1.5);return}if(e.boss&&SL3.ok){slime(e,tint,SL3,3.2);return}circ(e.x,e.y,e.r,tint||e.c);circ(e.x-e.r/3,e.y-e.r/4,e.r/6,'#000');circ(e.x+e.r/3,e.y-e.r/4,e.r/6,'#000')});
 G.E.forEach(e=>{if(e.rt>0)icon('roots',e.x,e.y+e.r*.3,'#8d5a2b',e.r,Math.round(e.r*2.6))});
 G.P.forEach(q=>q.sp==='wand'&&WS.ok?wandSpr(q):q.sp==='knife'&&KS.ok?knifeSpr(q):q.sp==='axe'&&AS.ok?axeSpr(q):circ(q.x,q.y,q.r,q.c));
 if(L('orb')&&G.orbOn){const n=L('orb')+1+m.g.n;for(let i=0;i<n;i++){const a=G.orbA+i*6.283/n;orbSpr(p.x+Math.cos(a)*75*m.area,p.y+Math.sin(a)*75*m.area,9*m.area*m.g.a)}}
 if(G.HP){for(const q of G.HP){cx.globalAlpha=Math.min(1,q.l*5);cx.fillStyle=q.c;cx.fillRect(Math.round(q.x),Math.round(q.y),q.s,q.s)}cx.globalAlpha=1}
 G.FX.forEach(f=>{if(f.sp==='bolt'&&LS.ok){boltSpr(f);return}cx.globalAlpha=f.t*4;circ(f.x,f.y,f.r,f.c);if(!f.nb){cx.fillStyle=f.c;cx.fillRect(f.x-3,f.y-500,6,500)}cx.globalAlpha=1});
 
 cx.restore();drawPlayer(p);drawObs(1);drawHp(p);drawJoy();if(G.fl>0){cx.globalAlpha=Math.min(.6,G.fl*1.5);cx.fillStyle=G.flc;cx.fillRect(0,0,W,H);cx.globalAlpha=1}
 // HUD
 const need_=need(p.lv);cx.fillStyle='#000a';cx.fillRect(0,0,W,18);cx.fillStyle='#29b6f6';cx.fillRect(0,0,Math.min(W,W*p.xp/need_),18);
 cx.fillStyle='#fff';cx.font='bold 10px "Press Start 2P",monospace';cx.textAlign='left';cx.fillText('Nv '+p.lv,8,13);
 cx.textAlign='center';const t=Math.floor(G.t);cx.font='bold 18px "Press Start 2P",monospace';cx.fillText(`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`,W/2,44);
 cx.font='bold 11px "Press Start 2P",monospace';cx.textAlign='right';cx.fillText(`🪙 ${G.coins}   ☠ ${G.kills}`,W-10,42);
 cx.textAlign='left';
 cx.fillStyle='#fff';cx.font='9px "Press Start 2P",monospace';let y=44;for(const k in G.inv){cx.fillText(`${ITEMS[k].k==='w'?'⚔':'✦'} ${ITEMS[k].n} ${G.inv[k]}`,10,y);y+=15}
 if(G.msgT>0){cx.textAlign='center';cx.font='bold 14px "Press Start 2P",monospace';cx.fillStyle='#f5c542';cx.fillText(G.msg,W/2,80)}}
let last=0;
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 if(G){if(!G.pause&&!G.paused&&!G.mapOpen&&!G.dead)update(dt);draw()}requestAnimationFrame(loop)}
// Ranking global: cole aqui a URL do Firebase Realtime Database (sem barra no final). Vazio = ranking local.
const lbKey=n=>n.replace(/[.$#\[\]\/]/g,'_');
async function lbGet(){if(LB_URL){try{const r=await fetch(LB_URL+'/lb.json');return(await r.json())||{}}catch(e){return null}}try{return JSON.parse(localStorage.getItem('vs_lb')||'{}')}catch(e){return {}}}
async function lbSubmit(k,t){if(!user||!k)return;t=Math.ceil(t)+1;const key=lbKey(user);try{
 if(LB_URL){const u=`${LB_URL}/lb/${encodeURIComponent(key)}.json`;const cur=await(await fetch(u)).json();if(cur&&cur.k>=k)return;await fetch(u,{method:'PUT',body:JSON.stringify({n:user,k,t})})}
 else{const d=JSON.parse(localStorage.getItem('vs_lb')||'{}');if(!d[key]||d[key].k<k){d[key]={n:user,k,t};localStorage.setItem('vs_lb',JSON.stringify(d))}}}catch(e){}}
$('openlb').onclick=async()=>{const box=$('lbl');$('lbm').classList.add('on');box.textContent='Carregando...';const d=await lbGet();
 if(d===null){box.textContent='Não foi possível carregar o ranking.';return}
 const a=Object.values(d).filter(x=>x&&typeof x.k==='number'&&typeof x.n==='string').sort((p,q)=>q.k-p.k).slice(0,20);box.textContent='';
 if(!a.length)box.textContent='Ninguém no ranking ainda. Seja o primeiro!';
 a.forEach((x,i)=>{const r=document.createElement('div'),l=document.createElement('span'),v=document.createElement('b');
  r.style.cssText='display:flex;justify-content:space-between;gap:20px;padding:8px 14px;margin:6px 3px;background:var(--card);box-shadow:0 0 0 3px '+(x.n===user?'var(--ac)':'#0d0a14');
  l.textContent=(i+1)+'. '+x.n.slice(0,16);v.textContent=x.k+' ☠';r.append(l,v);box.appendChild(r)});
 if(!LB_URL){const s=document.createElement('small');s.textContent='Ranking local: mostra apenas jogadores deste navegador.';box.appendChild(s)}};
$('lbc').onclick=()=>$('lbm').classList.remove('on');
$('ver').textContent='v'+VERSION;$('newb').textContent=seenOk()?'':'(NOVO)';
$('opennotes').onclick=()=>{renderNotes();$('notesm').classList.add('on');try{localStorage.setItem('vs_seen',VERSION)}catch(e){}$('newb').textContent=''};
$('notesc').onclick=()=>$('notesm').classList.remove('on');
$('pbtn').onclick=()=>{if(G&&!G.dead&&!G.pause&&!G.paused&&!G.mapOpen)togglePause()};if(MOB)$('hint').textContent='Toque e arraste na tela para mover (joystick). Ataques são automáticos. Sobreviva!';
$('openchars').onclick=()=>{buildChars();$('charm').classList.add('on')};$('charc').onclick=()=>$('charm').classList.remove('on');
$('mapsb').onclick=()=>$('mapm').classList.remove('on');$('mapx').onclick=closeMap;$('mapbtn').onclick=()=>{if(G&&!G.dead&&!G.pause&&!G.paused)G.mapOpen?closeMap():openMap()};
$('play').onclick=()=>{buildMaps();$('mapm').classList.add('on')};
$('opens').onclick=()=>{shop();$('shopm').classList.add('on')};$('shopc').onclick=()=>$('shopm').classList.remove('on');
function doLogin(){const n=$('nm').value.trim();if(!n||user)return;loadUser(n);$('login').classList.remove('on');shop()}
$('go').onclick=doLogin;$('nm').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')doLogin()});

{let su=null;try{su=localStorage.getItem('vs_user')}catch(e){}if(su)loadUser(su);else $('login').classList.add('on')}
function togglePause(){G.paused=!G.paused;try{G.paused?MUS.pause():MUS.play().catch(()=>{})}catch(e){}$('pausem').classList.toggle('on',G.paused)}
$('resume').onclick=togglePause;
$('quit').onclick=()=>{musicOff();$('pbtn').style.display='none';$('mapbtn').style.display='none';if(G)lbSubmit(G.kills,G.t);$('pausem').classList.remove('on');$('menu').classList.add('on');G=null;cx.clearRect(0,0,W,H);shop()};
$('cdxc').onclick=()=>{$('codex').classList.remove('on');$('tip').style.display='none'};
(()=>{const tp=$('tip'),cd=$('cdx');const show=e=>{const c=e.target.closest('.cxc');if(!c){tp.style.display='none';return}
 if(tp._c!==c){tp.innerHTML=c.querySelector('.det').innerHTML;tp._c=c}tp.style.display='flex';
 const w=tp.offsetWidth,h=tp.offsetHeight;tp.style.left=Math.max(8,Math.min(innerWidth-w-8,e.clientX+14))+'px';tp.style.top=Math.max(8,Math.min(innerHeight-h-8,e.clientY+14))+'px'};
 cd.addEventListener('mousemove',show);cd.addEventListener('click',show);cd.addEventListener('mouseleave',()=>tp.style.display='none')})();
$('opencdx').onclick=()=>{$('cdx').innerHTML=[['w','⚔ Armas'],['p','✦ Passivos']].map(([k,t])=>`<h2>${t}</h2><div class="row" style="margin:10px 0 18px">`+Object.keys(ITEMS).filter(i=>ITEMS[i].k===k).map(i=>{const it=ITEMS[i];return `<div class="card cxc" style="background:var(--card);border:2px solid #4b3b73;border-radius:10px;padding:10px"><span class="tag ${k==='p'?'p':''}">${k==='w'?'ARMA':'PASSIVO'}</span><b>${it.n}</b><span class="det"><small>${it.d}</small>${it.dt?`<small>Dano ${DT[it.dt]}</small>`:''}${UT[i]?`<small>${it.k==='p'?[1,2,3,4,5].map(n=>'Nv '+n+': '+UT[i](n)).join('<br>'):'Por nível: '+UT[i](1)}</small>`:''}<small>Nível máx: ${MAXL}</small></span></div>`}).join('')+'</div>').join('');$('codex').classList.add('on')};$('back').onclick=()=>{$('over').classList.remove('on');$('menu').classList.add('on');G=null;cx.clearRect(0,0,W,H);shop()};
shop();
})();