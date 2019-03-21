// TODO: should check to see if webgl exists or not
// Textures and stuff
// https://hdrihaven.com/
var MAX_TIME_STEP = 0.01;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

scene.background = new THREE.Color().setRGB(0.5, 0.1, 0.2);

// get the main window
var section = document.getElementId("simulation");
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var imgTexture = new THREE.TextureLoader().load( "assets/3d/textures/moon_1024.jpg",
                                                 function(){},
                                                 function(){},
                                                 function(){console.log("bad texture");});
imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
imgTexture.anisotropy = 16;

camera.position.z = 5;
camera.position.y = 1;

var controls = new THREE.OrbitControls( camera );

// create the simulation
var sim = new BouncerSim();
sim.initializeScene();

var currentstamp = null;
// Start the animation!
var animate = function (timestamp) {
    // Setup animation handle from website
		requestAnimationFrame( animate );

    var timeStep = Math.min(timestamp - currentstamp, MAX_TIME_STEP);
    currentstamp = timestamp;

    if (!isNaN(timeStep)) {
        sim.takeTimeStep(timeStep);
    }

		renderer.render( scene, camera );
};

animate();
