//COLORS
var Colors = {
    black:0x000000,
    rez:0x232420,
    grey:0x4f4f4f,
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x505050,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    green: 0x556B2F,
    pesoch: 0x9c7130,
    white2:0xFFFFFF,
};

// GAME VARIABLES
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var ennemiesPool = [];

// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(0xf7d9aa, 10,10000);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(100, 350, -200);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -1000;
  shadowLight.shadow.camera.right = 1000;
  shadowLight.shadow.camera.top = 1000;
  shadowLight.shadow.camera.bottom = -1000;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}



var AirPlane = function(){
	this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Create the cabin
	var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // Create Engine
  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
	this.mesh.add(engine);

  // Create Tailplane

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-35,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

  // Create Wing

  var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,0,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

  // Propeller

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // Blades

  var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8,0,0);
  blade.castShadow = true;
  blade.receiveShadow = true;
	this.propeller.add(blade);
  this.propeller.position.set(50,0,0);
  this.mesh.add(this.propeller);
};

Car = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "Uaz";

  //Кузов
  var geomCuzov = new THREE.BoxGeometry(180,90,280,1,1,1);
  var matCuzov = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomCuzov.vertices[2].z -= 10;
  geomCuzov.vertices[7].z -= 10;
  var cuzov = new THREE.Mesh(geomCuzov, matCuzov);
  cuzov.castShadow = true;
  cuzov.receiveShadow = true;
  this.mesh.add(cuzov);

  //Двигатель
  var geomEngine = new THREE.BoxGeometry(180,70,100,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomEngine.vertices[3].z += 10;
  geomEngine.vertices[6].z += 10;
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.set(0,-10,-190);
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  //Капот
  var geomEngineСover = new THREE.BoxGeometry(150,20,100,1,1,1);
  var matEngineСover = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomEngineСover.vertices[1].x -= 5;
  geomEngineСover.vertices[4].x += 5;
  geomEngineСover.vertices[0].x -= 5;
  geomEngineСover.vertices[5].x += 5;

  geomEngineСover.vertices[0].x += 15;
  geomEngineСover.vertices[2].x += 15;
  geomEngineСover.vertices[5].x -= 15;
  geomEngineСover.vertices[7].x -= 15;
  var engineСover = new THREE.Mesh(geomEngineСover, matEngineСover);
  engineСover.position.set(0,35,-190);
  engineСover.castShadow = true;
  engineСover.receiveShadow = true;
  this.mesh.add(engineСover);

  //Кабина
  var geomKab = new THREE.BoxGeometry(180,70,240,1,1,1);
  var matKab = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
  geomKab.vertices[3].z -= 40;
  geomKab.vertices[6].z -= 40;
  geomKab.vertices[0].z -= 10;
  geomKab.vertices[5].z -= 10;
  var kab = new THREE.Mesh(geomKab, matKab);
  kab.position.set(0,80,20);
  kab.castShadow = true;
  kab.receiveShadow = true;
  this.mesh.add(kab);
  //Стекло

  //Крыша
  var geomRoof = new THREE.BoxGeometry(180,5,230,1,1,1);
  var matRoof = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomRoof.vertices[1].z += 40;
  geomRoof.vertices[4].z += 40;
  geomRoof.vertices[0].z -= 10;
  geomRoof.vertices[5].z -= 10;
  geomRoof.vertices[1].x -= 5;
  geomRoof.vertices[4].x += 5;
  geomRoof.vertices[0].x -= 5;
  geomRoof.vertices[5].x += 5;
  var roof = new THREE.Mesh(geomRoof, matRoof);
  roof.position.set(0,118,15);
  roof.castShadow = true;
  roof.receiveShadow = true;
  this.mesh.add(roof);

  //Запасное колесо(резина)
  //var geomWheel = new THREE.CylinderGeometry(45,45,20,60,100);
  var geomWheel = new THREE.TorusGeometry( 30, 10, 40, 40, 360*Math.PI/180 );
    //geomWheel.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var matWheel = new THREE.MeshPhongMaterial({color:Colors.rez, shading:THREE.FlatShading});
  var wheel = new THREE.Mesh(geomWheel, matWheel);
  wheel.position.set(30,30,160);
  wheel.castShadow = true;
  wheel.receiveShadow = true;
  this.mesh.add(wheel);

  var geomWheel2 = new THREE.CylinderGeometry(28,28,15,60,100);
    geomWheel2.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var matWheel2 = new THREE.MeshPhongMaterial({color:Colors.white2, shading:THREE.FlatShading});
  var wheel2 = new THREE.Mesh(geomWheel2, matWheel2);
  wheel2.position.set(30,30,160);
  wheel2.castShadow = true;
  wheel2.receiveShadow = true;
  this.mesh.add(wheel2);

/*  var geom = new THREE.BoxGeometry(100,100,100,1,1);
  //geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.green
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
  this.mesh.castShadow = true;*/
}

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sea = function(){
  var geom = new THREE.CylinderGeometry(600,400,800,40,100);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
    transparent:true,
    opacity:.6,
    shading:THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Ground = function(){
  var geom = new THREE.BoxGeometry(10000,10,10000,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.pesoch
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Road = function(){
  var geom = new THREE.BoxGeometry(900,11,10000,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.brown
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

/*WhiteLine = function(){
  var geom = new THREE.BoxGeometry(40,12,200,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}*/



Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(20,20,20);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
  });

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

Text = function(){
  var geom = new THREE.TextGeometry( "Вася",{
  			size:500,
  			height:5,
  			curveSegments: 4,
  			font: "arial",
  			weight:"normal",
  			style:"normal",
  			hover:0,
  			bevelEnabled:false} );
  var mat = new THREE.MeshPhongMaterial({
          color:Colors.white
        });
  //var text_mesh = THREE.SceneUtils.createMultiMaterialObject( text_geometry, obj_material );
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
}

WhiteLine = function(){
  var geom = new THREE.BoxGeometry(40,12,200,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.receiveShadow = true;
  /*this.angle = 0;
  this.dist = 0;*/
}

WhiteLinesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.ennemiesInUse = [];
}

WhiteLinesHolder.prototype.spawnWhiteLines = function(){
  //var nEnnemies = int(1000/800);

  //for (var i=0; i<10000; i+=800){
    var ennemy;
    console.log('Pool '+ennemiesPool.length);
    if (ennemiesPool.length) {
      ennemy = ennemiesPool.pop();
    }else{
      ennemy = new WhiteLine();
    }
    ennemy.mesh.position.y = -200;
    ennemy.mesh.position.z = -10000;

    this.mesh.add(ennemy.mesh);
    this.ennemiesInUse.push(ennemy);
  //}
}

WhiteLinesHolder.prototype.rotateWhiteLines = function(){
  for (var i=0; i<this.ennemiesInUse.length; i++){
    var ennemy = this.ennemiesInUse[i];
    ennemy.mesh.position.z += 100;
    //console.log(this.ennemiesInUse.length);
    if (ennemy.mesh.position.z > 0) {
      //this.ennemiesInUse.splice(i,1)[0];
      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      i--;
    }/*
    ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;

    if (ennemy.angle > Math.PI*2) ennemy.angle -= Math.PI*2;

    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;
    ennemy.mesh.rotation.z += Math.random()*.1;
    ennemy.mesh.rotation.y += Math.random()*.1;

    //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
    var diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
    var d = diffPos.length();
    if (d<game.ennemyDistanceTolerance){
      particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);

      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      game.planeCollisionSpeedX = 100 * diffPos.x / d;
      game.planeCollisionSpeedY = 100 * diffPos.y / d;
      ambientLight.intensity = 2;

      removeEnergy();
      i--;
    }else if (ennemy.angle > Math.PI){
      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      i--;
    }*/
  }
}

// 3D Models
var sea;
var airplane;
var ground;
var car;
var road;

function createText(){
  text = new Text();
  text.mesh.scale.set(25,25,25);
  text.mesh.position.y = 00;
  text.mesh.position.z = -500;
  scene.add(text.mesh);
}

function createGround(){
  ground = new Ground();
  //road.mesh.scale.set(.25,.25,.25);
  ground.mesh.position.y = -200;
  ground.mesh.position.z = -5000;
  scene.add(ground.mesh);
}

function createRoad(){
  road = new Road();
  //road.mesh.scale.set(.25,.25,.25);
  road.mesh.position.y = -200;
  road.mesh.position.z = -5000;
  scene.add(road.mesh);
}

/*function createEnnemies(){
  for (var i=0; i<10; i++){
    var ennemy = new Ennemy();
    ennemiesPool.push(ennemy);
  }
  ennemiesHolder = new EnnemiesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(ennemiesHolder.mesh)
}*/

function createWhiteLine(){
  for (var i = 0; i < 10000; i += 800){
    var ennemy = new WhiteLine();
    ennemy.mesh.position.y = -200;
    ennemy.mesh.position.z = -i;
    ennemiesPool.push(ennemy);
  }
  WhiteLinesHolder = new WhiteLinesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(WhiteLinesHolder.mesh)

  /*for (var i = 0; i < 10000; i += 800){
    var ennemy = new WhiteLine();
    ennemy.mesh.position.y = -200;
    ennemy.mesh.position.z = -i;
    ennemiesPool.push(ennemy);
  }
  WhiteLinesHolder = new WhiteLinesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(WhiteLinesHolder.mesh)*/
}

function createCar(){
  car = new Car();
  car.mesh.scale.set(1.25,1.25,1.25);
  car.mesh.position.y = -100;
  car.mesh.position.z = -600;
  scene.add(car.mesh);
}

function createPlane(){
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -600;
  scene.add(sea.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}
var delta = 0;
function loop(){
  updatePlane();
  console.log('inUse '+WhiteLinesHolder.ennemiesInUse.length);
  if ((delta%-20) == 0){
    WhiteLinesHolder.spawnWhiteLines();
  }
  WhiteLinesHolder.rotateWhiteLines();
  //sea.mesh.rotation.z += .005;
  //sky.mesh.rotation.z += .01;
  //whiteLine.mesh.position.z += 100;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
  delta++;
}

function updatePlane(){
  var targetY = normalize(mousePos.y,-.75,.75,25, 175);
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  //airplane.mesh.position.y = targetY;
  //airplane.mesh.position.x = targetX;
  car.mesh.position.x = normalize(mousePos.x,-1,1,-400, 400);
  car.mesh.position.z = normalize(mousePos.y,-1,1,-400, -750);
  //airplane.propeller.rotation.x += 0.3;
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  //createPlane();
  //createSea();
//  createSky();
createText();
  createRoad();
  createGround();
  createWhiteLine();
  createCar();
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);