// Set up the scene and renderer

var scene = new THREE.Scene();
var sceneElem = $('.animation');
var sceneWidth = sceneElem.width();
var sceneHeight = sceneElem.height();
var camera = new THREE.PerspectiveCamera(50, sceneWidth/sceneHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(sceneWidth, sceneHeight);
sceneElem.append(renderer.domElement);

// Bring in audio

var listener = new THREE.AudioListener();
camera.add(listener);

var music = new THREE.Audio(listener);

var musicLoader = new THREE.AudioLoader();

musicLoader.load('/audio/music.mp3', function (buffer) {
  music.setBuffer(buffer);
  music.setLoop(true);
  music.setVolume(1);
});

// Create geometry

// var cube = new THREE.BoxGeometry(1,1,1);
// var material = new THREE.MeshBasicMaterial({color: 0xff3333});
// var model = new THREE.Mesh(cube, material);
// scene.add(model);
// model.position.z = -6;

var DaHeart = new THREE.Group();

var loader = new THREE.GLTFLoader();
loader.load('models/heart-v1.glb', function (gltf) {
  var heart = gltf.scene.children[0];
  var materialHeart = new THREE.MeshBasicMaterial({color: 0xff3333});
  var materialMonitor = new THREE.MeshBasicMaterial({color: 0x505050});
  var materialScreen = new THREE.MeshBasicMaterial({color: 0x23e0ad});
  var materialWireYellow = new THREE.MeshBasicMaterial({color: 0xf2e256});
  var materialWireBlue = new THREE.MeshBasicMaterial({color: 0x1db0ff});

  gltf.scene.traverse(function(child) {
    console.log(child);
  });

  DaHeart.add(heart);
  heart.scale.set(22,22,22);
  heart.material = materialHeart;

  heart.getObjectByName('Monitor').material = materialMonitor;
  heart.getObjectByName('Wire1').material = materialWireBlue;
  heart.getObjectByName('Wire2').material = materialWireYellow;
  heart.getObjectByName('Screen').material = materialScreen;
});

scene.add(DaHeart);
DaHeart.position.z = -6;


// Use the audio and geometry to drive some animation

var fftSize = 32;
var analyser = new THREE.AudioAnalyser( music, fftSize);

// Add interactivity

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane(new THREE.Vector3(0,0,1), 1);
var intersectPoint = new THREE.Vector3();

$('.animation').mousemove(function() {
  mouse.x = (event.clientX/sceneWidth)*2 - 1;
  mouse.y = -(event.clientY/sceneHeight)*2 + 1;
  console.log(mouse.x + ", " + mouse.y);

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectPoint);
  DaHeart.lookAt(intersectPoint);
});

sceneElem.click(function() {
  if (music.isPlaying) {
    music.pause();
  } else {
    music.play();
  }
});

// Render this dope stuff out, my dude

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  var musicRelScale = 1 + (analyser.getAverageFrequency()/255*0.2);
  var musicAbsScale = analyser.getAverageFrequency()/255;

  DaHeart.scale.setScalar(musicRelScale);
  DaHeart.children[0].rotation.y = DaHeart.children[0].rotation.y + 0.003;

  // model.scale.x = musicScale;
  // model.scale.y = musicScale;
  // model.scale.z = musicScale;
};

animate();
