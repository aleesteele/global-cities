//SCENE
var scene = new THREE.Scene(); //where all the code is coming from
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50); //trying to mimic how we see things, last is
camera.position.z = 30  // this what we play with get to things are the streen


//RENDER SCENE
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

//LIGHTING
var light = new THREE.AmbientLight( 0xFFFFFF );
scene.add( light );
//position where ligh ijf html
//difficult to understand!!
//or maybe i'm just

//MESH
var geometry = new THREE.SphereGeometry( 10, 32, 32 );
var material = new THREE.MeshPhongMaterial(); //the second artment is the first qfj
material.map = new THREE.TextureLoader().load('/public/imgs/earthmap4k.jpg') //materials map
var earthMesh = new THREE.Mesh( geometry, material ) //earthMesh!!
    // earthMesh.rotation.x += controls.guiRotationX
    // earthMesh.rotation.y += controls.guiRotationY
scene.add( earthMesh ); //materials and geometries that are used


//CONTROLS
dat.gui;
var controls = new function() {
    this.textColor = 0xffae23;
    this.guiRotationX = 0.005;
    this.guiRotationY = 0.005;
}

var gui = new dat.GUI();
gui.add(controls, 'guiRotationX', 0, .2);
gui.add(controls, 'guiRotationY', 0, .2);

gui.addColor(controls, 'textColor').onChange(function (e) {
    textMesh.material.color = new THREE.Color(e);
})

// earthMesh.rotation.x += controls.guiRotationX
// earthMesh.rotation.y += controls.guiRotationY
let textMesh;

var orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;


//RENDERER
var render = function() {
    requestAnimationFrame(render);
    earthMesh.rotation.x += controls.guiRotationX;
    earthMesh.rotation.y += controls.guiRotationY;
    renderer.render(scene, camera);
};
render();

//SKYBOX
var imagePrefix = "/public/imgs"
var urls = [ 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg' ]
var skyBox = new THREE.CubeTextureLoader().setPath(imagePrefix).load(urls);
scene.background = skyBox;
