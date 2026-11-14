const MS=[{id:'hp',n:'Vitalidade',d:'+20 vida máx',b:20},{id:'dmg',n:'Poder',d:'+8% dano',b:30},{id:'spd',n:'Botas',d:'+5% velocidade',b:25},{id:'mag',n:'Ímã',d:'+15% alcance de coleta',b:20},{id:'xp',n:'Sabedoria',d:'+8% XP',b:35},{id:'luck',n:'Sorte',d:'+5% de sorte (base 5%, máx 25%): chance de 4ª opção ao subir de nível',b:40,mx:4},{id:'cd',n:'Reflexos',d:'-4% de recarga das armas (máx 20%)',b:45,mx:5}];
const MAXL=5;
const ITEMS={
 wand:{k:'w',dt:'magico',n:'Varinha Mágica',d:'Dispara projéteis no inimigo mais próximo'},
 knife:{k:'w',dt:'fisico',n:'Facas',d:'Facas rápidas que miram no inimigo mais próximo'},
 orb:{k:'w',dt:'magico',n:'Orbes Giratórios',d:'Orbes orbitam ao redor de você por um tempo, somem e voltam'},
 aura:{k:'w',dt:'magico',n:'Aura Sombria',d:'Fere inimigos próximos continuamente'},
 bolt:{k:'w',dt:'eletrico',n:'Relâmpago',d:'Raios caem em inimigos aleatórios'},
 axe:{k:'w',dt:'fisico',n:'Machado',d:'Machados arremessados para cima que perfuram tudo'},
 might:{k:'p',n:'Força',d:'+15% de dano'},
 speed:{k:'p',n:'Agilidade',d:'+10% velocidade de movimento'},
 hp:{k:'p',n:'Coração',d:'+25 vida máxima'},
 haste:{k:'p',n:'Pressa',d:'-8% recarga das armas'},
 area:{k:'p',n:'Alcance',d:'+12% área e tamanho dos ataques'},
 magnet:{k:'p',n:'Atração',d:'+30% alcance de coleta'},
 regen:{k:'p',n:'Regeneração',d:'+0.6 vida por segundo'},
 growth:{k:'p',n:'Crescimento',d:'+10% XP ganho'},
 dur:{k:'p',n:'Duração',d:'+15% de duração dos efeitos das armas (ex: Orbes)'},
 steel:{k:'p',dt:'fisico',n:'Fúria de Aço',d:'Aprimora todas as armas de dano físico'},
 tome:{k:'p',dt:'magico',n:'Grimório Arcano',d:'Aprimora todas as armas de dano mágico'},
 dynamo:{k:'p',dt:'eletrico',n:'Dínamo Tempestuoso',d:'Aprimora todas as armas de dano elétrico'}};
const PX=2;
const IC={};
let SEED=0,OL=[];
const OB={t0:{x:4,y:51,w:39,h:46,ax:19,ay:40,cr:12,co:6},t1:{x:52,y:51,w:39,h:46,ax:19,ay:40,cr:12,co:6},t2:{x:100,y:51,w:39,h:46,ax:19,ay:40,cr:12,co:6},t3:{x:5,y:99,w:39,h:46,ax:19,ay:40,cr:12,co:6},
 r0:{x:126,y:127,w:34,h:32,ax:17,ay:30,cr:22,co:14},r1:{x:143,y:110,w:16,h:17,ax:8,ay:15,cr:11,co:9},r2:{x:128,y:112,w:15,h:14,ax:7,ay:12,cr:10,co:8},r3:{x:128,y:97,w:15,h:13,ax:7,ay:11,cr:10,co:8}};
const DC=[{x:49,y:4,w:7,h:3},{x:70,y:4,w:7,h:5},{x:58,y:10,w:5,h:3},{x:26,y:146,w:4,h:3},{x:8,y:167,w:4,h:3},{x:8,y:183,w:4,h:3}];
const HC={fisico:['#ffffff','#cfd8dc','#ffcc80'],magico:['#e0b3ff','#b57bff','#ffffff'],eletrico:['#fff59d','#ffeb3b','#ffffff']};
const VERSION='3.1.2';
const PATCHES=[
 {v:'3.1.2',d:'14/11/2026',n:['A Cidadela agora tem música própria.','A barra de vida do Mr.WorldWide agora tem o mesmo tamanho da do Merlin.','Cidadela: casas com novos sprites e hitbox ajustada ao tamanho de cada casa, e mais lixo espalhado pelo mapa.']},
 {v:'3.1.1',d:'12/11/2026',n:['O sprite do Mr.WorldWide agora tem o mesmo tamanho do Merlin.','Mr.WorldWide só aparece na Cidadela entre 1200 e 2600 unidades de distância do ponto inicial (nem colado, nem longe demais).','O mapa aberto (J) ficou bem maior: agora mostra uma área de 256x256 quadrados (antes 128x128).']},
 {v:'3.1.0',d:'12/11/2026',n:['Dificuldade muito maior: a vida dos inimigos agora é multiplicada por 3 a cada 10 minutos (10, 20 e 30 min), o dano e a velocidade crescem com o tempo e os inimigos nascem mais rápido.','Depois de 30 minutos só nascem bosses (no máximo 14 ao mesmo tempo).','Gemas de XP: ao chegar a 100 gemas de um mesmo tipo no chão, elas se fundem em uma única gema maior de cor diferente (laranja, dourada ou prateada), mantendo a soma exata do XP.']},
 {v:'3.0.0',d:'12/11/2026',n:['GRANDE ATUALIZAÇÃO: A Queda da Cidadela!','Ao clicar em Jogar agora você escolhe o mapa: Floresta (o de sempre) ou a nova Cidadela, uma cidade em ruínas gerada de forma procedural com quarteirões, ruas, prédios, muros de tijolo, cercas de arame com entradas e lixo. Tudo tem colisão, e as entradas das cercas e muros ficam livres.','Na Cidadela os inimigos são zumbis: pequeno (fraco), grande (forte) e com machado (boss).','Novo personagem: Mr.WorldWide, que começa com a arma Faca. Ele vem bloqueado: na Cidadela há 20% de chance de ele aparecer na partida; encostar nele o desbloqueia. Futuros personagens bloqueados funcionarão do mesmo jeito.','Nova tela Personagens no menu inicial para escolher quem jogar.','Mapa aberto: aperte J (ou o botão MAPA no celular) para ver o terreno ao redor, sua posição e a de personagens para desbloquear. O jogo fica pausado enquanto o mapa está aberto.','Depois de 10 minutos só nascem inimigos fortes.','Bosses com muito mais vida e imunes ao Cometa.','Novo item raro dos objetos quebráveis: Ímã, que puxa todo o XP do mapa até você.','Ao subir de nível com tudo no máximo, você ganha 10 moedas.','Melhorias permanentes bem mais caras: o preço sobe 1,7x a cada nível.','Objetos quebráveis agora soltam menos moedas e com menos frequência.']},
 {v:'2.4.1',d:'12/11/2026',n:['A barra de vida agora fica sempre embaixo do personagem, em um estilo minimalista de pixels (fundo escuro, preenchimento vermelho com um brilho fino).','Lista de armas e passivos subiu um pouco no canto da tela, já que a barra antiga saiu de lá.']},
 {v:'2.4.0',d:'12/11/2026',n:['Versão para celular: o jogo detecta aparelhos de toque e mostra um joystick virtual, que aparece onde você encosta o dedo e move o Merlin com velocidade proporcional ao quanto você arrasta.','Botão de pause na tela para celular (as opções de upgrade, menus e botões continuam clicáveis normalmente).','Menus ajustados para telas pequenas: agora dá para rolar até o topo e as cartas ficam menores em telas baixas.']},
 {v:'2.3.2',d:'12/11/2026',n:['Corrigido: as opções de upgrade não apareciam ao subir de nível (um conflito com o botão de Opções do pause).']},
 {v:'2.3.1',d:'12/11/2026',n:["Corrigido: o menu de Opções aparecia atrás do menu de pause. Agora o pause some ao abrir as Opções e volta ao fechá-las, com o jogo continuando pausado.", "Versões do histórico reorganizadas pelo tamanho de cada atualização: pequena muda o último número, média o do meio e massiva o primeiro."]},
 {v:'2.3.0',d:'12/11/2026',n:["Corrigido o sprite do coração, que estava recortado errado.", "Novo menu Opções no pause, com a aba Áudio: volume separado para música e efeitos sonoros (salvo no navegador).", "Cristais de XP e baús de boss que caírem sobre água, árvore ou pedra são empurrados para o lugar livre mais próximo.", "Nova melhoria permanente: Reflexos (-4% de recarga das armas por nível, até 20%).", "Objetos quebráveis agora têm 20% de chance de dropar um item (antes 10%), com menos cometas: coração 52%, raízes 40%, cometa 8%.", "Um pouco menos de inimigos surgem ao longo do tempo."]},
 {v:'2.2.0',d:'12/11/2026',n:["Inimigos fortes (grandes) agora dão 3x mais XP e os bosses 15x, com cristais de cores diferentes (verde e roxo).", "Bosses agora também deixam um cristal de XP além do baú.", "Objetos quebráveis têm chance de dropar um item além de moedas: Coração (cura 25% da vida), Cometa (elimina os inimigos da tela; bosses perdem 40% da vida atual) e Raízes (imobilizam os inimigos da tela por 4 segundos)."]},
 {v:'2.1.1',d:'12/11/2026',n:["Novo botão Novidades no menu inicial com o histórico de atualizações.", "A versão atual do jogo aparece no canto do menu inicial.", "Aviso (NOVO) no botão quando há uma versão que você ainda não viu."]},
 {v:'2.1.0',n:["Música durante as runs (tecla M liga e desliga o som).", "Sons para Varinha, Facas, Machado, Relâmpago e level up.", "Efeito de impacto (faíscas coloridas por tipo de dano) quando um ataque acerta.", "Menus redesenhados em estilo pixel art; menu inicial na vertical.", "Sprites novos: Faca, Machado (gira ao ser lançado), Varinha, Relâmpago (cai de pé) e Orbes (animação sincronizada com a duração)."]},
 {v:'2.0.0',n:["Novo personagem: Merlin (sistema pronto para mais personagens).", "Slimes no lugar dos inimigos: verde (fracos), azul (fortes) e de lava (boss).", "Cristal azul para o XP, moeda para o dinheiro, baú de madeira (objetos) e baú dourado (boss).", "Mapa procedural novo a cada run, com lagos, árvores e pedras que bloqueiam o movimento."]},
 {v:'1.3.0',n:["Login por nome (um nome por computador, salvo no navegador).", "Ranking global de inimigos derrotados em uma única run.", "Proteções contra pontuações impossíveis no ranking."]},
 {v:'1.2.0',n:["Passivos por tipo de dano: Fúria de Aço (físico), Grimório Arcano (mágico) e Dínamo Tempestuoso (elétrico), com 5 níveis cada.", "Inimigos colidem entre si; o jogador ainda os atravessa.", "Jogo se adapta ao tamanho da tela; inimigos sempre nascem fora da vista.", "Facas deixam de atravessar inimigos sem o upgrade."]},
 {v:'1.1.0',n:["Atributo Sorte: chance de uma 4ª opção ao subir de nível (melhorável no menu).", "Codex com todas as armas e passivos.", "Tipos de dano nas armas (mágico, físico, elétrico).", "Menu de pause; sair da run descarta as moedas.", "Orbes giratórias com duração e passivo Duração.", "Limite de 6 armas e 6 passivos; Machado adicionado."]},
 {v:'1.0.0',n:["Primeira versão: movimento com WASD e ataques automáticos.", "XP, level up com 3 opções, armas e passivos.", "Chefe a cada 5 minutos com baú que melhora um upgrade.", "Moedas e melhorias permanentes no menu inicial."]}
];
let VOL={m:35,s:50};
let MOB=false;
const JOY={on:false,x:0,y:0,ox:0,oy:0,kx:0,ky:0,R:56,seen:false,id:null};
const MAPS={floresta:{name:'Floresta',desc:'Lagos, árvores e pedras. O mapa clássico.'},cidadela:{name:'Cidadela',desc:'Cidade em ruínas tomada por zumbis: quarteirões com prédios, muros e cercas.'}};
const ATL={};
const ATLU={"bg": SPR_7, "rf": SPR_8, "bw": SPR_9, "wf": SPR_10, "gb": SPR_11};
const GR=[[2,0],[0,0],[0,2],[2,2]],ASP=[[1,10],[1,11],[0,8]],SW=[[8,0],[10,0],[8,2]],GBC=[[0,0],[3,0],[1,0],[2,1],[3,1],[0,1]];
const ZU={"small": {"down": SPR_12, "up": SPR_13, "right": SPR_14, "left": SPR_15}, "big": {"down": SPR_16, "up": SPR_17, "right": SPR_18, "left": SPR_19}, "axe": {"down": SPR_20, "up": SPR_21, "right": SPR_22, "left": SPR_23}},ZN={small:6,big:8,axe:8},ZK={small:2,big:2,axe:3},ZS={};
const GK=['gem','gemg','gemp','gemf0','gemf1','gemf2'],GF=['#4fc3f7','#66bb6a','#ba68c8','#ff7043','#ffd54f','#eceff1'];
let G=null,keys={},running=false;
const DT={magico:'Mágico',fisico:'Físico',eletrico:'Elétrico'};
const LB_URL='https://survivalist-1eb3c-default-rtdb.firebaseio.com';
const CIDB=['Assets/mapas/cidadela/sprite_0039.png','Assets/mapas/cidadela/sprite_0043.png','Assets/mapas/cidadela/sprite_0040.png','Assets/mapas/cidadela/sprite_0045.png'];
const CIDH=['0001','0003','0002','0006','0004','0005','0008','0010'].map(n=>'Assets/mapas/cidadela/sprite_'+n+'.png');
