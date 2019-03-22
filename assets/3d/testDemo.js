// TODO: should check to see if webgl exists or not
// Textures and stuff
// https://hdrihaven.com/
var MAX_TIME_STEP = 0.01;



// get the main window
var canvas;
var renderer;
var simScene;

init();
animate();

function init() {
    canvas = document.getElementById("simulation");

    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize( canvas.innerWidth, canvas.innerHeight );
    renderer.domElement = canvas;
    // document.body.appendChild( renderer.domElement );

    // create scene
    simScene = new THREE.Scene();
    simScene.background = new THREE.Color().setRGB(0.5, 0.1, 0.2);

    // create the simulation
    var bouncesim = new BouncerSim();
    bouncesim.initializeScene(simScene);
    simScene.userData.sim = bouncesim;

    // var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
    camera.position.z = 8;
    camera.position.y = 3;
    simScene.userData.camera = camera;

    var controls = new THREE.OrbitControls( camera );
    simScene.userData.controls = controls;
}

var currentstamp = null;
// Start the animation!
function animate(timestamp) {
    // Setup animation handle from website
		requestAnimationFrame( animate );
    updateSize();

    var timeStep = Math.min(timestamp - currentstamp, MAX_TIME_STEP);
    currentstamp = timestamp;

    if (!isNaN(timeStep)) {
        simScene.userData.sim.takeTimeStep(timeStep);
    }

		renderer.render( simScene, simScene.userData.camera );
};

function updateSize() {
		var width = canvas.clientWidth;
		var height = canvas.clientHeight;
		if ( canvas.width !== width || canvas.height !== height ) {
				renderer.setSize( width, height, false );
		}
}
