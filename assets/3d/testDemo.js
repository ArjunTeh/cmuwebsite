// TODO: should check to see if webgl exists or not
// Textures and stuff
// https://hdrihaven.com/
var MAX_TIME_STEP = 0.01;

// Simulation
var bouncesim;

// Simulation visualization
var simCanvas;
var simScene;
var simRenderer;

// Energy visualization
var visCanvas;
var visScene;
var visRenderer;

// Plot Canvas
var plotCanvas;

init();
animate();

function init() {
    // get the canvases
    simCanvas = document.getElementById("simulation");
    visCanvas = document.getElementById("energy");
    plotCanvas = document.getElementById("plot");

    // create scenes
    simScene = new THREE.Scene();
    simScene.background = new THREE.Color().setRGB(0.5, 0.1, 0.2);

    visScene = new THREE.Scene();
    visScene.background = new THREE.Color().setRGB(0.7, 0.7, 0.7);

    simRenderer = new THREE.WebGLRenderer({canvas: simCanvas, antialias: true});
    setupRenderer(simCanvas, simScene, simRenderer);

    visRenderer = new THREE.WebGLRenderer({canvas: visCanvas, antialias: true});
    setupRenderer(visCanvas, visScene, visRenderer);

    // create the simulation
    bouncesim = new BouncerSim();
    bouncesim.initializeSimulationScene(simScene);
    bouncesim.initializeEnergyScene(visScene);
    bouncesim.initializePlot(plotCanvas);
}

function setupRenderer(canvas, scene, renderer) {
    renderer.setSize( canvas.innerWidth, canvas.innerHeight );
    renderer.domElement = canvas;
    // document.body.appendChild( renderer.domElement );

    // var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
    camera.position.z = 8;
    camera.position.y = 3;
    scene.userData.camera = camera;

    var controls = new THREE.OrbitControls( camera, canvas );
    scene.userData.controls = controls;
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
        bouncesim.takeTimeStep(timeStep);
    }

		simRenderer.render( simScene, simScene.userData.camera );
    visRenderer.render( visScene, visScene.userData.camera );
};

function updateSize() {
		var width = simCanvas.clientWidth;
		var height = simCanvas.clientHeight;
		if ( simCanvas.width !== width || simCanvas.height !== height ) {
				simRenderer.setSize( width, height, false );
		}

		width = simCanvas.clientWidth;
		height = simCanvas.clientHeight;
		if ( visCanvas.width !== width || visCanvas.height !== height ) {
				visRenderer.setSize( width, height, false );
		}
}
