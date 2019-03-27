/** Bouncer Sim
    * A simple physics simulation of a ball bouncing without loss of energy
    * along with a visualization of the corresponding phase space
    */
class BouncerSim{
    constructor() {
        this.ball_vel = new THREE.Vector3();
        this.gravity = new THREE.Vector3(0, 9.8, 0);
    }

    get position() {
        return this.ball.position.y;
    }

    get velocity() {
        return this.ball_vel.y;
    }

    get energy() {
        calcEnergy();
    }

    calcEnergy() {
        return 0.5*this.ball_vel.lengthSq() + this.gravity.y*this.ball.position.y;
    }

    takeTimeStep(timestep) {
        this.ball_vel.addScaledVector(this.gravity, -timestep);
        this.ball.translateY(timestep*this.ball_vel.y);

        this.resolveCollisions();
        this.drawPhase();
    }

    resolveCollisions() {
        // so instead, the collision itself could be considered a world reversal
        // upon collision, everything should be backwards
        if (this.ball.position.y < 0) {
            this.ball_vel.y = -this.ball_vel.y;
            this.ball.position.y += 2*(-this.ball.position.y);
        }
    }

    drawPhase() {
        if (this.ctx) {
            this.ctx.fillStyle = 'rgb(220,220,220)';
            this.ctx.fillRect(0, 0, this.plot.width, this.plot.height);

            // get the xy coordinates
            var x = 20*this.position;
            var y = 10*this.velocity;
            x = x + this.plot.width/2;
            y = y + this.plot.height/2;

            this.ctx.beginPath();
            this.ctx.fillStyle = 'red';
            this.ctx.arc(x, y, 5, 0, 2*Math.PI, true);
            this.ctx.fill();
            this.visMaterial.map.needsUpdate = true;
        }
    }

    initializeSimulationScene(scene) {
        // add lights
        scene.add( new THREE.AmbientLight( 0x222222 ) );
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 1, 1, 1 ).normalize();
        scene.add( directionalLight );
        scene.add( new THREE.AmbientLight( 0x772266 ) );

        // create the ball
        var geometry = new THREE.SphereGeometry(0.5, 32, 32);
        var diffuseColor = new THREE.Color().setRGB(0.2, 0.8, 0.8);
        var ball_material = new THREE.MeshStandardMaterial({
		        color: diffuseColor,
		        metalness: 0.2,
		        roughness: 0.7,
            envMap: null
        });
        this.ball = new THREE.Mesh( geometry, ball_material );
        this.ball.position.y += 3;
        scene.add( this.ball );

        // create the plane
        geometry = new THREE.PlaneBufferGeometry(20, 20, 2, 2);
        diffuseColor.setRGB(0.3, 0.3, 0.3);
        var floor_material = new THREE.MeshStandardMaterial({
		        color: diffuseColor,
		        metalness: 0.2,
		        roughness: 0.9,
            envMap: null
        });
        var floor = new THREE.Mesh( geometry, floor_material );
        floor.translateY(-0.5);
        floor.rotateX(THREE.Math.degToRad(-90.0));
        scene.add( floor );

    }

    initializeEnergyScene(scene) {
        // add lights
        scene.add( new THREE.AmbientLight( 0x222222 ) );
        scene.add( new THREE.AmbientLight( 0x772266 ) );
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0.1, 1, 0.1 ).normalize();
        scene.add( directionalLight );

        // var geometry = new THREE.CylinderGeometry(0.1, 2, 4, 32, 2);
        // NOTE: The first indices are the top vertices that are collapsed into one spot
        // NOTE: The second half of the indices should be considered a radial equation away
        var geometry = new THREE.ConeGeometry(2, 4, 3);
        var diffuseColor = new THREE.Color().setRGB(0.8, 0.8, 0.2);
        var material = new THREE.MeshStandardMaterial({
		        color: diffuseColor,
		        metalness: 0.2,
		        roughness: 0.7,
            envMap: null
        });
        console.log(geometry.faces);
        console.log(geometry.faceVertexUvs);
        this.vis = new THREE.Mesh( geometry, material );
        scene.add( this.vis );
        this.visMaterial = material;
    }

    initializePlot(plot) {
        this.plot = plot;
        this.plot.width = 256;
        this.plot.height = 256;
        this.ctx = plot.getContext('2d');
        this.plotTexture = new THREE.CanvasTexture(plot);
        this.visMaterial.map = this.plotTexture;
        this.drawPhase();
    }

}
