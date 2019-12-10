// Set up the scene and renderer

var scene = new THREE.Scene();
var sceneElem = $('.animation');
var sceneWidth = sceneElem.width();
var sceneHeight = sceneElem.height();
var camera = new THREE.PerspectiveCamera(75, sceneWidth/sceneHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({alpha: true});
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

var DaCube = new THREE.Mesh(cube, material);
scene.add(DaCube);

DaCube.position.z = -5;

// Use the audio and geometry to drive some animation

var fftSize = 32;
var analyser = new THREE.AudioAnalyser( music, fftSize);

// Render this dope stuff out, my dude

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  var musicScale = analyser.getAverageFrequency()/100 + 1;

  DaCube.scale.setScalar(musicScale);

  // DaCube.scale.x = musicScale;
  // DaCube.scale.y = musicScale;
  // DaCube.scale.z = musicScale;
};

animate();

// Add interactivty

sceneElem.click(function() {
  if (music.isPlaying) {
    music.pause();
  } else {
    music.play();
  }
});
