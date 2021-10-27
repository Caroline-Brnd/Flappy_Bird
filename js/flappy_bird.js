// Initialisation du canvas
var canvas = document.getElementById('game_canvas');
var context = canvas.getContext('2d');


//---------------- VARIABLES ----------------//
// Dimensions du jeu
var echelle = 3;
var width = 144;
var height = 257;

// Dimensions canvas
canvas.width = width * echelle;
canvas.height = height * echelle;

var pc={
  l: 26,
  h: 160,
  xv: 1.6,
  ecart_height: 50,
  temps_att: 50,
  start_x: width + 50,
  min_y: 70,
  max_y: 180
};

var pb={
  l: 52,
  h: 29,
  x: width / 2 - 26,
  y: height / 2 - 14
};

var etatJeu;
var sol;
var oiseau;
var tuyaux;
var tuyauxTime;
var score;
var jeuTime;


//--------------- IMAGES ----------------//
// Créer un mappage
var imgs={};
var ajoutImage = function(nom, src){
  imgs[nom] = new Image();
  imgs[nom].src = src;
  imgs[nom].onload = function(){
    imageCharge();
  }
  numImages++;
};

// Vérification des chargements d'images
var numImages = 0;
var numCharge = 0;
var imageCharge = function(){
  numCharge++;
  if(numCharge === numImages){
    reinitialisationJeu();
  }
};

// Ajouter les images
ajoutImage('bg', './imgs/background-mario.png');
ajoutImage('oiseau_chap', './imgs/bird-chap.png');
ajoutImage('sol', './imgs/black-ground.png');
ajoutImage('tuyau_haut', './imgs/pipe_top.png');
ajoutImage('tuyau_bas', './imgs/pipe-red-bottom.png');
ajoutImage('bouton_play', './imgs/play_btn.png');
ajoutImage('gameover', './imgs/gameover.png');
ajoutImage('0', './imgs/zero.png');
ajoutImage('1', './imgs/one.png');
ajoutImage('2', './imgs/two.png');
ajoutImage('3', './imgs/three.png');
ajoutImage('4', './imgs/four.png');
ajoutImage('5', './imgs/five.png');
ajoutImage('6', './imgs/six.png');
ajoutImage('7', './imgs/seven.png');
ajoutImage('8', './imgs/eight.png');
ajoutImage('9', './imgs/nine.png');


//------------------ JEU ------------------//
// Initialiser les objets du jeu + la boucle de jeu
var reinitialisationJeu = function(){
  clearTimeout(jeuTime);
  etatJeu = 'ready';
  sol={
    l: 168,
    h: 56,
    x: 0,
    y: (height - 56)
  };

  oiseau={
    l: 17,
    h: 12,
    x: 35,
    y: 120,
    v: 0
  };

  tuyaux=[];
  tuyauxTime=0;
  score=0;
  majJeu();
};


//-------------- UTILISATEUR --------------//
// Animation -> Clic
var clicSouris = function(e){
  // Clic (x;y) coin supérieur gauche du canvas
  var x = e.layerX/echelle;
  var y = e.layerY/echelle;
  if(etatJeu === 'ready'){
    etatJeu = 'play';
  }
  if(etatJeu === 'play' && oiseau.y+oiseau.h > 0){
    oiseau.v = Math.min(0, oiseau.v);
    oiseau.v -= 3;
    oiseau.v = Math.max(-3, oiseau.v);
  }
  else if(etatJeu == 'gameover'){
    if((x > pb.x && x < pb.x+pb.l) && (y > pb.y && y < pb.y+pb.h)){
      reinitialisationJeu();
    }
  }
};
canvas.addEventListener('mousedown', clicSouris);


//-------- FONCTION PRINCIPALE --------//
// Rectification de taille
var imageEchelle = function(img, x, y, l, h){
  context.drawImage(img, x*echelle, y*echelle, l*echelle, h*echelle);
};

// Generation de tuyaux
var genereTuayau = function(){
  var tuyau={
    x: pc.start_x,
    y: pc.min_y + Math.random() * (pc.max_y - pc.min_y),
  };
  tuyaux.push(tuyau);
};

// Test de collision
var collision = function(oiseau, tuyau){
  return (oiseau.x+oiseau.l > tuyau.x && oiseau.x < tuyau.x+pc.l) && (oiseau.y+oiseau.h > tuyau.y || oiseau.y < tuyau.y-pc.ecart_height)
};

// Affichage du Score
var afficheScore = function(){
  var i, x, y, img, scorewidth = 0, scoreStr = score.toString();
  for(i=0; i<scoreStr.length; i++){
    scorewidth += imgs[scoreStr.charAt(i)].width;
  }
  x = width/2 - scorewidth/2;
  y = height/6;
  for(i=0; i<scoreStr.length; i++){
    img = imgs[scoreStr.charAt(i)];
    imageEchelle(img, x, y, img.width, img.height);
    x += img.width;
  }
};

// Boucle du jeu
var majJeu = function(){
  var i, tuyau, hautY;
  if(etatJeu === 'play'){
    if(tuyauxTime >= pc.temps_att){
      genereTuayau();
      tuyauxTime=0;
    }
    for(i=0; i<tuyaux.length; i++){
      tuyaux[i].x -= pc.xv;
      if(tuyaux[i].x < oiseau.x && tuyaux[i].x+pc.xv > oiseau.x){
        score++;
      }
    }
    if(tuyaux.length > 0 && tuyaux[0].x < -pc.l){
      tuyaux.shift();
    }
    tuyauxTime++;
    sol.x -= pc.xv;
    if(sol.x <= -(sol.l - width)){
      sol.x = 0;
    }

    oiseau.y += oiseau.v;
    oiseau.v += .2;

    for(i = 0; i < tuyaux.length; i++){
      if(collision(oiseau, tuyaux[i])){
        etatJeu = 'gameover';
      }
    }
    if(oiseau.y + oiseau.h > sol.y){
      etatJeu = 'gameover';
    }
  }

  imageEchelle(imgs.bg, 0, 0, width, height);
  for(i=0; i<tuyaux.length; i++){
    tuyau = tuyaux[i];
    imageEchelle(imgs.tuyau_bas, tuyau.x, tuyau.y, pc.l, pc.h);
    hautY = tuyau.y - pc.ecart_height - pc.h;
    imageEchelle(imgs.tuyau_haut, tuyau.x, hautY, pc.l, pc.h);
  }
  imageEchelle(imgs.sol, sol.x, sol.y, sol.l, sol.h);
  imageEchelle(imgs.oiseau_chap, oiseau.x, oiseau.y, oiseau.l, oiseau.h);
  afficheScore();
  if(etatJeu == 'gameover'){
    imageEchelle(imgs.bouton_play, pb.x, pb.y, pb.l, pb.h);
  }

  jeuTime = setTimeout(majJeu, 25);
};