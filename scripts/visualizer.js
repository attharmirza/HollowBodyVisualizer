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

var cube = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0xff3333});

var model = new THREE.Mesh(cube, material);
scene.add(model);

model.position.z = -6;

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
  model.lookAt(intersectPoint);
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

  var musicRelScale = 1 + analyser.getAverageFrequency()/255;
  var musicAbsScale = analyser.getAverageFrequency()/255;

  model.scale.setScalar(musicRelScale);

  // model.scale.x = musicScale;
  // model.scale.y = musicScale;
  // model.scale.z = musicScale;
};

animate();
