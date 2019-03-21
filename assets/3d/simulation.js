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
        return this.ball_vel;
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
    }

    resolveCollisions() {
        if (this.ball.position.y < 0.5) {
            this.ball_vel.y = -this.ball_vel.y;
            this.ball.position.y += 2*(0.5-this.ball.position.y);
        }
    }

    initializeScene() {
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
        // floor.translateY(-3);
        floor.rotateX(THREE.Math.degToRad(-90.0));
        scene.add( floor );

    }

}
