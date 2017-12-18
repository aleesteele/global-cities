//3JS OF EARTH//

//SCENE
var scene = new THREE.Scene(); //where all the code is coming from
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50); //trying to mimic how we see things, last is

camera.position.x = 1;
camera.position.y = 3;
camera.position.z = 30;  // this what we play with get to things are the streen

camera.lookAt(new THREE.Vector3(0,0,0));

//RENDER SCENE
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

//LIGHTING
var light = new THREE.AmbientLight( 0xFFFFFF );
scene.add( light );

//EARTH MESH!!
var earthGeometry = new THREE.SphereGeometry( 10, 32, 32 );
var earthMaterial = new THREE.MeshPhongMaterial(); //the second artment is the first qfj
    earthMaterial.map = new THREE.TextureLoader().load('/public/imgs/finalearthmap.png') //materials map
var earthMesh = new THREE.Mesh( earthGeometry, earthMaterial ) //earthMesh!!
    // earthMesh.rotation.x += controls.guiRotationX
    // earthMesh.rotation.y += controls.guiRotationY
scene.add( earthMesh ); //materials and geometries that are used

//CLOUDS
var cloudGeometry = new THREE.SphereGeometry(10.2, 32, 32);
var cloudMaterial = new THREE.MeshLambertMaterial({transparent: true, opacity: 0.4});
    cloudMaterial.map = new THREE.TextureLoader().load('/public/imgs/clouds.png')
var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
scene.add(cloudMesh);


//ATMOSPHERE OF EARTH
var atmosphereGeometry = new THREE.SphereGeometry(10.3, 32, 32);
var atmosphereMaterial = new THREE.MeshLambertMaterial({color: 0x1C49F4, transparent: true, opacity: 0.02});
    // atmosphereMaterial.map = new THREE.TextureLoader().load('/public/imgs/clouds.png')
var atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
scene.add(atmosphereMesh);



//CONTROLS
dat.gui;
var controls = new function() {
    this.guiRotationX = 0.000;
    this.guiRotationY = 0.000;
}
var gui = new dat.GUI();
gui.add(controls, 'guiRotationX', 0, .0);
gui.add(controls, 'guiRotationY', 0, .2);




//RENDER BASE EARTH
var render = function() {
    requestAnimationFrame(render);
    earthMesh.rotation.x += controls.guiRotationX;
    earthMesh.rotation.y += controls.guiRotationY;
    cloudMesh.rotation.x += 0.000;
    cloudMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
};
render();

//SKYBOX
var imagePrefix = "/public/imgs/"
var urls = [ 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg' ]
var skyBox = new THREE.CubeTextureLoader().setPath(imagePrefix).load(urls);
scene.background = skyBox;
