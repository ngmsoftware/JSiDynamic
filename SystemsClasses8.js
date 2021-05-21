
class DCMotor {


	constructor(canvas, dt) {
		this.scale = 0.5;

		this.RK_STEPS = 10;

		this.canvas = canvas;

		this.dt = dt;

		this.ang = 0.0;
		this.vel = 0.0;
		this.acc = 0.0;
		this.voltage = 0.0;
		this.current = 0.0;


		this.inertia = 0.5;
		this.friction = 1.1;
		this.resistance = 2.0;
		this.inductance = 0.25;
		this.Kv = 100.1;
		this.Kt = 1.5;

		this.P = 1.0;

		this.drawingImages = false;
		this.drawingBlocks = true;
	}



	dynamicStep(angInput, ang, vel, acc, inertia, friction, resistance, inductance, Kv, Kt, P) {

		let inputScale = 35.0;

        let y = ang/inputScale;
		let ref = angInput/inputScale;
		let e1 = ref - y;
		let u1 = P*e1

		let angp = vel;
		let velp = acc;
		let accp = (Kt*u1 - (resistance*inertia + friction*inductance)*acc - (Kt*Kv + resistance*friction)*vel)/(inertia*inductance);

		return [angp, velp, accp]
	}


	rkStep(angInput, ang, vel, acc, inertia, friction, resistance, inductance, Kv, Kt, P, dt) {

		let k1 = this.dynamicStep(angInput, ang,                vel,                acc,                inertia, friction, resistance, inductance, Kv, Kt, P);
		let k2 = this.dynamicStep(angInput, ang + dt*k1[0]/2.0, vel + dt*k1[1]/2.0, acc + dt*k1[2]/2.0, inertia, friction, resistance, inductance, Kv, Kt, P);
		let k3 = this.dynamicStep(angInput, ang + dt*k2[0]/2.0, vel + dt*k2[1]/2.0, acc + dt*k2[2]/2.0, inertia, friction, resistance, inductance, Kv, Kt, P);
		let k4 = this.dynamicStep(angInput, ang + dt*k3[0],     vel + dt*k3[1],     acc + dt*k3[2],     inertia, friction, resistance, inductance, Kv, Kt, P);

		this.ang += dt*(k1[0] + 2.0*k2[0] + 2.0*k3[0] + k4[0])/6.0;
		this.vel += dt*(k1[1] + 2.0*k2[1] + 2.0*k3[1] + k4[1])/6.0;
		this.acc += dt*(k1[2] + 2.0*k2[2] + 2.0*k3[2] + k4[2])/6.0;



	}



	update(angInput, ang, vel, acc, inertia, friction, resistance, inductance, Kv, Kt, P) {


		this.angInput = angInput;

		this.ang = ang;
		this.vel = vel;
		this.acc = acc;


		this.inertia = inertia;
		this.friction = friction;
		this.resistance = resistance;
		this.inductance = inductance;
		this.Kv = Kv;
		this.Kt = Kt;
		this.P = P;


		this.rkStep(angInput, ang, vel, acc, inertia, friction, resistance, inductance, Kv, Kt, P, this.dt/this.RK_STEPS)

	}


	load() {
		loadModel('images/system8/motor.obj', (x) => {
			this.motorModel = x;
		});

		loadModel('images/system8/circuit.obj', (x) => {
			this.circuitModel = x;
		});

		loadModel('images/system8/connectors.obj', (x) => {
			this.connectorsModel = x;
		});

		loadModel('images/system8/redWires.obj', (x) => {
			this.redWiresModel = x;
		});

		loadModel('images/system8/blackWires.obj', (x) => {
			this.blackWiresModel = x;
		});

		loadModel('images/system8/whiteWires.obj', (x) => {
			this.whiteWiresModel = x;
		});

		loadModel('images/system8/pot1.obj', (x) => {
			this.pot1Model = x;
		});

		loadModel('images/system8/pot2.obj', (x) => {
			this.pot2Model = x;
		});

		loadModel('images/system8/pot3.obj', (x) => {
			this.pot3Model = x;
		});

		loadModel('images/system8/gearOut1.obj', (x) => {
			this.gearOut1Model = x;
		});

		loadModel('images/system8/gearOut2.obj', (x) => {
			this.gearOut2Model = x;
		});

		loadModel('images/system8/gearOut3.obj', (x) => {
			this.gearOut3Model = x;
		});

		loadModel('images/system8/knobOut.obj', (x) => {
			this.knobOutModel = x;
		});

		loadModel('images/system8/knobRef.obj', (x) => {
			this.knobRefModel = x;
		});




		this.diagram = loadImage('images/system8/diagram.svg');
	}



	drawBlocks() {

	    var pixelScale = 35;

	    let px = -150;
	    let py = -120;

	    let p1x = 48;
	    let p1y = 38;

	    let p2x = 192;
	    let p2y = 147;


	    var posRef = this.angInput*10;

	    if (posRef > 800) {
	    	posRef = 800;
	    }
	    if (posRef < -800) {
	    	posRef = -800;
	    }
	    if (posRef === undefined) {
	    	posRef = 0;
	    }

	    var posOut = this.ang*10;

	    if (posOut > 800) {
	    	posOut = 800;
	    }
	    if (posOut < -800) {
	    	posOut = -800;
	    }
	    if (posOut === undefined) {
	    	posOut = 0;
	    }


		camera(0, -30, width/8, 0, -30, 0, 0, 1, 0);

		image(this.diagram, px, py, this.diagram.width/4, this.diagram.height/4);

		stroke('blue');
		line(px + p1x, py+p1y, px + p1x + 12, py + p1y + posRef/100);

		stroke('magenta');
		line(px + p2x, py+p2y, px + p2x - 12, py + p2y + posOut/100);


	}



	drawImages(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.circuitModel && this.motorModel && this.redWiresModel && this.connectorsModel && this.pot1Model && this.pot2Model && this.pot3Model && this.blackWiresModel
			&& this.whiteWiresModel && this.gearOut1Model && this.gearOut2Model && this.gearOut3Model && this.knobOutModel && this.knobRefModel) {

			fill(255);


			if (this.angInput === undefined) {
				this.angInput = 0.0;
			}

		    var pixelScale = 35;
		    var angleScale = 1.0;

		    if (isNaN(dist)) {
		    	dist = width;
		    }

		    push();
		    let _cameraX = 0;
		    let _cameraY = 0;
		    let _cameraZ = dist;

		    let _cameraX2 = _cameraX;
		    let _cameraY2 = _cameraY*cos(cameraPhi) - _cameraZ*sin(cameraPhi);
		    let _cameraZ2 = _cameraY*sin(cameraPhi) + _cameraZ*cos(cameraPhi);


		    let _cameraX3 = _cameraX2*cos(cameraTeta) + _cameraZ2*sin(cameraTeta);
		    let _cameraY3 = _cameraY2;
		    let _cameraZ3 = -_cameraX2*sin(cameraTeta) + _cameraZ2*cos(cameraTeta);


			camera(_cameraX3, _cameraY3, _cameraZ3, 0, 0, 0, 0, 1, 0);

			scale(pixelScale, -pixelScale, pixelScale);

			var fov = PI/12;
			var cameraZ = (height/2.0) / tan(fov/2.0);
			perspective(fov,width/height, cameraZ/10.0, cameraZ*10.0);	

			directionalLight(255,255,255, 0, 10, -5);
			pointLight(255,255,255, 0, 100, -50);
			ambientLight(55,55,55);



		    push();
		    noStroke();
		    ambientMaterial(0.8*255, 0.753*255, 0.567*255);
		    model(this.motorModel);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.581*255);
		    model(this.circuitModel);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.373*255, 0.8*255, 0.394*255);
		    model(this.connectorsModel);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.8*255, 0.006*255, 0.015*255);
		    model(this.redWiresModel);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.13*255);
		    model(this.blackWiresModel);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.98*255);
		    model(this.whiteWiresModel);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.8*255);
		    model(this.pot1Model);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.281*255, 0.144*255, 0.083*255);
		    model(this.pot2Model);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.8*255, 0.608*255, 0.386*255);
		    model(this.pot3Model);
		    pop();


		    push();
		    noStroke();
		    ambientMaterial(0.8*255);
		    translate(0, 2.5, 0);
		    rotateX(angleScale*this.ang/pixelScale);
		    translate(0, -2.5, 0);
		    model(this.gearOut1Model);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.8*255);
		    translate(0.0, 2.5, 4.6);
		    rotateX(-(1.0/2.6666)*angleScale*this.ang/pixelScale);
		    translate(0.0, -2.5, -4.6);
		    model(this.gearOut2Model);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.8*255);
		    translate(4.8, 2.5, 6.6);
		    rotateZ(angleScale*this.ang/pixelScale);
		    translate(-4.8, -2.5, -6.6);
		    model(this.gearOut3Model);
		    pop();



		    push();
		    noStroke();
		    ambientMaterial('magenta');
		    translate(4.8, 2.5, 6.6);
		    rotateZ(angleScale*this.ang/pixelScale);
		    translate(-4.8, -2.5, -6.6);
		    model(this.knobOutModel);
		    pop();


		    push();
		    noStroke();
		    ambientMaterial('blue');
		    translate(1.45, 2.5, 6.6);
		    rotateZ(angleScale*this.angInput/pixelScale);
		    translate(-1.45, -2.5, -6.6);
		    model(this.knobRefModel);
		    pop();



		    pop();


		}

	}



	draw(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.drawingBlocks) this.drawBlocks();

		if (this.drawingImages) this.drawImages(cameraTeta, cameraPhi, dist);
		
	}





}