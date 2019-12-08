// Set up the scene and renderer

var scene = new THREE.Scene();
var sceneWidth = $('.animation').width();
var sceneHeight = $('.animation').height();
var camera = new THREE.PerspectiveCamera(75, sceneWidth/sceneHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(sceneWidth, sceneHeight);
$('.animation').append(renderer.domElement);


// Start adding stuff into it

var cube = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0xff3333});

var DaCube = new THREE.Mesh(cube, material);
scene.add(DaCube);

DaCube.position.z = -5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
