// Evolucoes de armas (carregado depois de data.js e antes de game.js).
// Duas armas Nv 5 de TIPOS DE DANO diferentes + bau de boss = 1 evolucao (15 armas -> 75 pares). A evolucao e uma FUSAO:
//  - a arma de maior prioridade (EVR) empresta o CORPO: formato do sprite e movimento (b), quantidade (n), velocidade, raio, recarga e dano base
//  - a outra empresta o EFEITO ao acertar (ef), a paleta de cores e as particulas
//  - causa os dois tipos de dano (cada projetil sorteia um) e usa os bonus dos dois tipos
// Nome = substantivo do corpo + adjetivo do efeito (ex.: Faca + Varinha = "Adaga Arcana").
// EVW: t tipo, no substantivo, g genero (0 m, 1 f), ad adjetivos [m,f], b movimento (proj arc boom orbit fan beam strike nova), n qtd, sp velocidade, r raio, l vida/duracao, c recarga, d dano base, R raio da orbita, pr perfuracao, ef efeito, pal [contorno,cor,luz,detalhe], bd/ed textos
const EVW={
 knife:{t:'fisico',no:'Adaga',g:1,ad:['Afiado','Afiada'],b:'proj',n:4,sp:520,r:6,l:1.2,c:.55,d:23,ef:'pierce',pal:['#3a4450','#cfd8dc','#ffffff','#8d6e3f'],bd:'lança 4 adagas no inimigo mais próximo',ed:'atravessa todos os inimigos'},
 axe:{t:'fisico',no:'Machado',g:0,ad:['Rachador','Rachadora'],b:'arc',n:3,sp:0,r:11,l:2.4,c:1.1,d:39,pr:99,ef:'cleave',pal:['#5a2a00','#ff9800','#ffd180','#8d6e3f'],bd:'arremessa 3 machados em arco',ed:'racha os inimigos ao redor do alvo'},
 chakram:{t:'fisico',no:'Chakram',g:0,ad:['Ricocheteante','Ricocheteante'],b:'boom',n:2,sp:480,r:14,l:3,c:1,d:32,pr:999,ef:'bounce',pal:['#37474f','#b0bec5','#eceff1','#ffca28'],bd:'lança 2 chakrams que vão e voltam',ed:'ricocheteia para outro inimigo'},
 scythe:{t:'fisico',no:'Foice',g:1,ad:['Ceifador','Ceifadora'],b:'orbit',n:3,R:70,r:16,l:3,c:3.8,d:48,pr:999,ef:'crit',pal:['#2a3540','#e8eef2','#ffffff','#6b4a2a'],bd:'gira 3 lâminas ao seu redor',ed:'30% de chance de golpe duplo'},
 hammer:{t:'fisico',no:'Martelo',g:0,ad:['Atordoante','Atordoante'],b:'fan',n:5,sp:360,r:12,l:.35,c:1,d:90,pr:99,ef:'stun',pal:['#33445e','#9ec9e8','#dff3ff','#ffffff'],bd:'golpeia em leque à frente',ed:'atordoa o alvo'},
 fireball:{t:'magico',no:'Bola de Fogo',g:1,ad:['Flamejante','Flamejante'],b:'proj',n:3,sp:340,r:10,l:2,c:1,d:21,ef:'burn',pal:['#5a1400','#ff7a1a','#ffd34a','#ff3b1a'],bd:'dispara 3 bolas de fogo',ed:'queima e paralisa o alvo'},
 venom:{t:'magico',no:'Nuvem',g:1,ad:['Peçonhento','Peçonhenta'],b:'proj',n:2,sp:250,r:12,l:2.4,c:.9,d:12,pr:3,ef:'poison',pal:['#2a0f3a','#c46de6','#e8b0ff','#7fe05a'],bd:'solta 2 nuvens tóxicas lentas',ed:'envenena o alvo'},
 wand:{t:'magico',no:'Varinha',g:1,ad:['Arcano','Arcana'],b:'proj',n:3,sp:330,r:7,l:2,c:.6,d:35,ef:'homing',pal:['#2a1250','#b57bff','#e0b3ff','#ffffff'],bd:'dispara 3 projéteis mágicos',ed:'persegue os inimigos'},
 orb:{t:'eletrico',no:'Orbe',g:0,ad:['Encadeante','Encadeante'],b:'orbit',n:4,R:80,r:11,l:3.5,c:4.3,d:23,pr:999,ef:'chain',pal:['#5a2a14','#ff7043','#ffccbc','#ffeb3b'],bd:'gira 4 orbes ao seu redor',ed:'o raio salta para 2 inimigos próximos'},
 laser:{t:'eletrico',no:'Feixe',g:0,ad:['Revelador','Reveladora'],b:'beam',n:1,sp:760,r:7,l:.7,c:2.2,d:22,pr:999,ef:'vuln',pal:['#5a4a00','#ffeb3b','#fffbd0','#ff9800'],bd:'dispara um feixe perfurante na direção em que você olha',ed:'deixa o alvo vulnerável (+25% de dano)'},
 bolt:{t:'eletrico',no:'Relâmpago',g:0,ad:['Enraizante','Enraizante'],b:'strike',n:4,r:16,l:.5,c:1.2,d:70,pr:99,ef:'root',pal:['#5a4a00','#f9e34b','#ffffff','#6fd0ff'],bd:'faz 4 raios caírem sobre inimigos próximos',ed:'prende o alvo no chão'},
 tempestari:{t:'eletrico',no:'Tempestade',g:1,ad:['Explosivo','Explosiva'],b:'proj',n:3,sp:430,r:8,l:1.4,c:1,d:44,ex:45,ef:'burst',pal:['#2a1060','#b57bff','#f0e0ff','#ffeb3b'],bd:'dispara 3 esferas que explodem em área',ed:'explode em área'},
 mana:{t:'magico',no:'Onda',g:1,ad:['Cintilante','Cintilante'],b:'nova',n:12,sp:210,r:6,l:.9,c:3.5,d:18,pr:3,ef:'sparks',pal:['#144a6e','#5ee0ff','#b3f5ff','#ff7bc4'],bd:'solta uma onda de 12 estrelas em círculo',ed:'solta faíscas ao acertar'},
 aura:{t:'magico',no:'Pulso',g:0,ad:['Repulsor','Repulsora'],b:'nova',n:10,sp:150,r:9,l:1.1,c:1.4,d:35,pr:99,ef:'push',pal:['#5a2414','#ffd24a','#fff1b8','#f08a24'],bd:'emite um pulso de 10 anéis em círculo',ed:'empurra o alvo'},
 shield:{t:'eletrico',no:'Égide',g:1,ad:['Vampírico','Vampírica'],b:'orbit',n:3,R:46,r:12,l:4,c:4.8,d:40,pr:999,ef:'leech',pal:['#5a4a00','#f9e34b','#fff7b0','#ffffff'],bd:'gira 3 escudos de energia ao seu redor',ed:'cura você a cada acerto'}};
// prioridade do CORPO (a que vem antes na lista entrega o formato; a outra entrega o efeito)
const EVR=['knife','axe','chakram','scythe','hammer','fireball','venom','wand','orb','laser','bolt','tempestari','mana','aura','shield'];
// formatos de sprite 16x16 apontando para a direita. P = {K contorno, A cor, B luz, C detalhe}
const EVS={
 knife:(R,E,P)=>{const{K,A,B,C}=P;R(0,7,4,3,K);R(1,8,3,1,C);R(4,4,2,9,K);R(4,5,1,7,A);R(6,6,8,5,K);R(6,7,8,3,A);R(6,7,8,1,B);R(14,7,2,3,K);R(14,8,1,1,B)},
 axe:(R,E,P)=>{const{K,A,B,C}=P;R(0,9,12,3,K);R(1,10,11,1,C);R(8,2,5,10,K);R(9,3,3,8,A);R(9,3,3,1,B);R(12,4,3,6,K);R(12,5,2,4,A)},
 chakram:(R,E,P)=>{const{K,A,B,C}=P;E(8,8,7,7,K);E(8,8,6,6,A);E(8,8,3,3,K);R(8,0,1,2,B);R(8,14,1,2,B);R(0,8,2,1,B);R(14,8,2,1,B);R(3,3,2,1,B);R(5,5,1,1,C)},
 scythe:(R,E,P)=>{const{K,A,B,C}=P;R(7,3,3,13,K);R(8,4,1,11,C);R(8,0,7,3,K);R(9,1,6,1,B);R(9,2,4,1,A);R(13,3,3,3,K);R(14,3,1,2,A)},
 hammer:(R,E,P)=>{const{K,A,B,C}=P;R(0,7,9,3,K);R(1,8,8,1,C);R(8,2,6,12,K);R(9,3,4,10,A);R(9,3,4,2,B);R(14,5,2,6,K);R(14,6,1,4,A)},
 fireball:(R,E,P)=>{const{K,A,B,C}=P;R(0,6,5,5,K);R(1,7,4,3,C);R(2,8,2,1,B);E(10,8,5,5,K);E(10,8,4,4,A);E(11,8,2,2,B);R(8,5,2,1,B)},
 venom:(R,E,P)=>{const{K,A,B,C}=P;E(5,9,4,3,K);E(5,9,3,2,A);E(10,7,4,4,K);E(10,7,3,3,A);E(9,11,3,2,K);E(9,11,2,1,A);R(9,5,2,1,B);R(4,8,2,1,B);R(10,8,1,1,C);R(7,10,1,1,C)},
 wand:(R,E,P)=>{const{K,A,B,C}=P;R(0,8,11,2,K);R(1,8,10,1,C);R(10,5,6,8,K);R(11,6,4,6,A);R(10,8,6,2,A);R(12,7,2,4,B)},
 orb:(R,E,P)=>{const{K,A,B,C}=P;E(8,8,7,7,K);E(8,8,6,6,A);R(5,4,3,3,B);R(10,9,3,3,C)},
 laser:(R,E,P)=>{const{K,A,B,C}=P;R(0,6,16,5,K);R(1,7,15,3,A);R(1,8,15,1,B);R(13,4,3,9,K);R(14,5,2,7,C)},
 bolt:(R,E,P)=>{const{K,A,B,C}=P;R(9,0,5,5,K);R(7,3,5,5,K);R(5,6,6,4,K);R(8,8,5,4,K);R(6,11,5,5,K);R(10,1,3,3,A);R(8,4,3,3,A);R(7,7,3,2,A);R(9,9,3,2,A);R(7,12,3,3,A);R(10,1,2,1,B);R(8,4,2,1,B)},
 tempestari:(R,E,P)=>{const{K,A,B,C}=P;E(8,8,7,7,K);E(8,8,6,6,A);E(8,8,3,3,B);R(1,1,2,2,C);R(13,1,2,2,C);R(1,13,2,2,C);R(13,13,2,2,C);R(7,7,2,2,'#ffffff')},
 mana:(R,E,P)=>{const{K,A,B,C}=P;R(7,0,2,16,K);R(0,7,16,2,K);R(6,6,4,4,K);R(7,1,2,14,A);R(1,7,14,2,A);R(7,7,2,2,B);R(4,4,1,1,C);R(11,4,1,1,C);R(4,11,1,1,C);R(11,11,1,1,C)},
 aura:(R,E,P)=>{const{K,A,B,C}=P;R(0,0,16,16,K);R(1,1,14,14,A);R(3,3,10,10,K);R(4,4,8,8,B);R(6,6,4,4,K);R(7,7,2,2,C)},
 shield:(R,E,P)=>{const{K,A,B,C}=P;R(2,0,12,3,K);R(1,2,14,8,K);R(2,3,12,6,A);R(2,3,12,1,B);R(3,10,10,2,K);R(5,12,6,2,K);R(4,9,8,3,A);R(6,12,4,1,A);R(7,4,2,6,C)}};
// gera as 75 evolucoes: EV[id]={d:corpo,e:efeito}, EVID[a|b] = id (nos dois sentidos) e a entrada em ITEMS (ev:1, dt/dt2 = os dois tipos)
const EV={},EVID={};
for(const a of EVR)for(const b of EVR){if(EVR.indexOf(a)>=EVR.indexOf(b)||EVW[a].t===EVW[b].t)continue;
 const id='ev_'+a+'_'+b,A=EVW[a],B=EVW[b];EV[id]={d:a,e:b};EVID[a+'|'+b]=EVID[b+'|'+a]=id;
 ITEMS[id]={k:'w',ev:1,dt:A.t,dt2:B.t,mx:1,n:A.no+' '+B.ad[A.g],d:'Evolução de '+ITEMS[a].n+' + '+ITEMS[b].n+': '+A.bd+'; '+B.ed+'.'}}
// enfeites por EFEITO (16x16, desenhados por cima do corpo): cada um dos 15 efeitos deixa uma marca propria no sprite. P tem K,A,B,C (corpo) e D (detalhe do efeito)
const EVA={
 pierce:(R,E,P)=>{const{B,D}=P;R(0,3,5,1,B);R(1,5,3,1,D);R(0,12,6,1,B);R(2,14,3,1,D)},
 cleave:(R,E,P)=>{const{B,D}=P;R(12,0,1,1,D);R(13,1,2,2,B);R(15,3,1,1,D);R(15,0,1,1,D);R(12,3,1,1,D)},
 bounce:(R,E,P)=>{const{B,D}=P;R(1,12,1,1,D);R(2,13,1,1,D);R(1,14,1,1,D);R(3,12,1,1,B);R(4,13,1,1,B);R(3,14,1,1,B);R(13,1,1,1,D);R(14,2,1,1,D);R(13,3,1,1,D)},
 crit:(R,E,P)=>{const{B,D}=P;R(0,1,4,1,D);R(1,0,2,3,D);R(1,1,2,1,B);R(13,13,3,1,D);R(14,12,1,3,D)},
 stun:(R,E,P)=>{const{B,D}=P;[[1,0],[7,0],[13,1]].forEach(([x,y])=>{R(x,y+1,3,1,D);R(x+1,y,1,3,D);R(x+1,y+1,1,1,B)})},
 burn:(R,E,P)=>{const{B,D}=P;R(3,3,1,3,D);R(4,1,1,5,B);R(5,3,1,3,D);R(10,4,1,3,D);R(11,2,1,5,B);R(12,4,1,2,D);R(7,0,1,2,D)},
 poison:(R,E,P)=>{const{B,D}=P;R(3,12,1,3,D);R(3,15,1,1,B);R(8,13,1,2,D);R(12,12,1,3,D);R(12,15,1,1,B);R(6,14,1,1,B)},
 homing:(R,E,P)=>{const{B,D}=P;R(1,1,1,1,B);R(0,2,3,1,D);R(1,3,1,1,D);R(3,13,1,1,B);R(2,14,3,1,D);R(3,15,1,1,D);R(5,2,1,1,B);R(7,1,1,1,D)},
 chain:(R,E,P)=>{const{B,D}=P;R(0,4,2,1,D);R(1,5,1,2,D);R(2,6,2,1,D);R(3,7,1,2,B);R(12,9,2,1,D);R(13,10,1,2,D);R(14,11,2,1,B)},
 vuln:(R,E,P)=>{const{D}=P;R(0,0,3,1,D);R(0,0,1,3,D);R(13,0,3,1,D);R(15,0,1,3,D);R(0,15,3,1,D);R(0,13,1,3,D);R(13,15,3,1,D);R(15,13,1,3,D)},
 root:(R,E,P)=>{const{B,D}=P;R(2,14,3,1,D);R(1,12,1,3,D);R(6,15,5,1,D);R(7,13,1,3,D);R(11,14,3,1,D);R(13,12,1,3,D);R(4,12,1,1,B);R(9,12,1,1,B)},
 burst:(R,E,P)=>{const{B,D}=P;R(0,7,2,2,D);R(14,7,2,2,D);R(7,0,2,2,D);R(7,14,2,2,D);R(2,2,1,1,B);R(13,2,1,1,B);R(2,13,1,1,B);R(13,13,1,1,B)},
 sparks:(R,E,P)=>{const{B,D}=P;R(1,1,1,1,B);R(14,2,1,1,D);R(2,13,1,1,D);R(13,14,1,1,B);R(14,8,1,1,B);R(1,8,1,1,D);R(8,1,1,1,D);R(8,14,1,1,B)},
 push:(R,E,P)=>{const{B,D}=P;R(14,4,1,8,D);R(15,6,1,4,B);R(12,3,1,1,D);R(12,12,1,1,D);R(0,4,1,8,D)},
 leech:(R,E,P)=>{R(1,11,2,2,'#ff5a7a');R(4,11,2,2,'#ff5a7a');R(0,12,7,2,'#ff5a7a');R(1,14,5,1,'#ff5a7a');R(2,15,3,1,'#c03050');R(1,11,1,1,'#ffc0cc')}};
// sprite da evolucao: corpo + enfeite do efeito, ampliado k vezes (2 = 32px, 3 = 48px) com Scale2x/3x + contorno fino + luz/sombra (NMscale/NMrefine em enemies.js)
const EVC={};
function evCv(id,k){k=k||2;const key=id+k;if(EVC[key])return EVC[key];const V=EV[id],S=16,g=Array.from({length:S},()=>Array(S).fill(null)),
 R=(x,y,w,h,c)=>{for(let j=Math.max(0,y);j<Math.min(S,y+h);j++)for(let i=Math.max(0,x);i<Math.min(S,x+w);i++)g[j][i]=c},
 E=(X,Y,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const q=Math.round(rx*Math.sqrt(Math.max(0,1-j*j/((ry*ry)||1))));R(X-q,Y+j,2*q+1,1,c)}},pe=EVW[V.e].pal,P={K:pe[0],A:pe[1],B:pe[2],C:EVW[V.d].pal[1],D:pe[3]};
 EVS[V.d](R,E,P);EVA[EVW[V.e].ef](R,E,P);
 const N=S*k,o=NMscale(g,S,k);NMrefine(o,N,k);const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
 for(let y=0;y<N;y++){let i=0;while(i<N){const q=o[y][i];let w=1;while(i+w<N&&o[y][i+w]===q)w++;if(q){x.fillStyle=q;x.fillRect(i,y,w,1)}i+=w}}
 return EVC[key]=c}
