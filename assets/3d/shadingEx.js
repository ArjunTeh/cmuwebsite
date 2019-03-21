var container, stats;
var camera, scene, renderer, controls;
var particleLight;
var loader = new THREE.FontLoader();
loader.load( 'fonts/gentilis_regular.typeface.json', function ( font ) {
		init( font );
		animate();
} );

function init( font ) {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.set( 0.0, 400, 400 * 3.5 );
		//
		var genCubeUrls = function ( prefix, postfix ) {
				return [
						prefix + 'px' + postfix, prefix + 'nx' + postfix,
						prefix + 'py' + postfix, prefix + 'ny' + postfix,
						prefix + 'pz' + postfix, prefix + 'nz' + postfix
				];
		};
		scene = new THREE.Scene();
		var hdrUrls = genCubeUrls( './textures/cube/pisaHDR/', '.hdr' );
		var hdrCubeRenderTarget = null;
		// Materials
		var imgTexture = new THREE.TextureLoader().load( "textures/planets/moon_1024.jpg" );
		imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
		imgTexture.anisotropy = 16;
		imgTexture = null;
		new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, hdrUrls, function ( hdrCubeMap ) {
				var pmremGenerator = new THREE.PMREMGenerator( hdrCubeMap );
				pmremGenerator.update( renderer );
				var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
				pmremCubeUVPacker.update( renderer );
				hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
				var bumpScale = 1;
				var cubeWidth = 400;
				var numberOfSphersPerSide = 5;
				var sphereRadius = ( cubeWidth / numberOfSphersPerSide ) * 0.8 * 0.5;
				var stepSize = 1.0 / numberOfSphersPerSide;
				var geometry = new THREE.SphereBufferGeometry( sphereRadius, 32, 16 );
				var index = 0;
				for ( var alpha = 0; alpha <= 1.0; alpha += stepSize ) {
						for ( var beta = 0; beta <= 1.0; beta += stepSize ) {
							  for ( var gamma = 0; gamma <= 1.0; gamma += stepSize ) {
								    // basic monochromatic energy preservation
								    var diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 );
								    var material = new THREE.MeshStandardMaterial( {
									      map: imgTexture,
									      bumpMap: imgTexture,
									      bumpScale: bumpScale,
									      color: diffuseColor,
									      metalness: beta,
									      roughness: 1.0 - alpha,
									      envMap: index % 2 === 0 ? null : hdrCubeRenderTarget.texture
								    } );
								    index ++;
								    var mesh = new THREE.Mesh( geometry, material );
								    mesh.position.x = alpha * 400 - 200;
								    mesh.position.y = beta * 400 - 200;
								    mesh.position.z = gamma * 400 - 200;
								    scene.add( mesh );
							  }
						}
						index ++;
				}
				hdrCubeMap.magFilter = THREE.LinearFilter;
				hdrCubeMap.needsUpdate = true;
				scene.background = hdrCubeMap;
				pmremGenerator.dispose();
				pmremCubeUVPacker.dispose();
		} );

		function addLabel( name, location ) {
				var textGeo = new THREE.TextBufferGeometry( name, {
						font: font,
						size: 20,
						height: 1,
						curveSegments: 1
				} );
				var textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
				var textMesh = new THREE.Mesh( textGeo, textMaterial );
				textMesh.position.copy( location );
				scene.add( textMesh );
		}
		addLabel( "+roughness", new THREE.Vector3( - 350, 0, 0 ) );
		addLabel( "-roughness", new THREE.Vector3( 350, 0, 0 ) );
		addLabel( "-metalness", new THREE.Vector3( 0, - 300, 0 ) );
		addLabel( "+metalness", new THREE.Vector3( 0, 300, 0 ) );
		addLabel( "-diffuse", new THREE.Vector3( 0, 0, - 300 ) );
		addLabel( "+diffuse", new THREE.Vector3( 0, 0, 300 ) );
		particleLight = new THREE.Mesh( new THREE.SphereBufferGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
		scene.add( particleLight );
		// Lights
		scene.add( new THREE.AmbientLight( 0x222222 ) );
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 1, 1, 1 ).normalize();
		scene.add( directionalLight );
		var pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
		particleLight.add( pointLight );
		//
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.toneMapping = THREE.Uncharted2ToneMapping;
		renderer.toneMappingExposure = 0.75;
		//
		stats = new Stats();
		container.appendChild( stats.dom );
		controls = new THREE.OrbitControls( camera );
		window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
}

//
function animate() {
		requestAnimationFrame( animate );
		render();
		stats.update();
}

function render() {
		var timer = Date.now() * 0.00025;
		//camera.position.x = Math.cos( timer ) * 800;
		//camera.position.z = Math.sin( timer ) * 800;
		camera.lookAt( scene.position );
		particleLight.position.x = Math.sin( timer * 7 ) * 300;
		particleLight.position.y = Math.cos( timer * 5 ) * 400;
		particleLight.position.z = Math.cos( timer * 3 ) * 300;
		renderer.render( scene, camera );
}
