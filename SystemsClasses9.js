
class DoubleBar {


	constructor(canvas, dt) {
		this.scale = 0.5;

		this.RK_STEPS = 10;

		this.canvas = canvas;

		this.dt = dt;

		this.bar1Angle = 0.0;
		this.bar2Angle = 0.0;
		this.bar1Velocity = 0.0;
		this.bar2Velocity = 0.0;



		this.bar1SpringConstant = 0.5;
		this.bar1Friction = 1.1;
		this.bar1Inertia = 2.0;
		this.bar2SpringConstant = 0.5;
		this.bar2Friction = 1.1;
		this.bar2Inertia = 2.0;


		this.drawingImages = false;
		this.drawingBlocks = true;
	}



	dynamicStep(bar1TorqueInput, bar1Angle, bar2Angle, bar1Velocity, bar2Velocity, bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia) {


		let bar1Anglep = bar1Velocity;
		let bar2Anglep = bar2Velocity - bar1Velocity;
		let bar1Velocityp = (bar1SpringConstant*(bar1TorqueInput - bar1Angle) - bar1Velocity*bar1Friction)/bar1Inertia;
		let bar2Velocityp = (bar2SpringConstant*(bar1Angle - bar2Angle) - bar2Velocity*bar2Friction)/bar2Inertia;

		return [bar1Anglep, bar2Anglep, bar1Velocityp, bar2Velocityp]
	}


	rkStep(bar1TorqueInput, bar1Angle, bar2Angle, bar1Velocity, bar2Velocity, bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia, dt) {

		let k1 = this.dynamicStep(bar1TorqueInput, bar1Angle,                bar2Angle,                bar1Velocity,                bar2Velocity,                bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia);
		let k2 = this.dynamicStep(bar1TorqueInput, bar1Angle + dt*k1[0]/2.0, bar2Angle + dt*k1[1]/2.0, bar1Velocity + dt*k1[2]/2.0, bar2Velocity + dt*k1[3]/2.0, bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia);
		let k3 = this.dynamicStep(bar1TorqueInput, bar1Angle + dt*k2[0]/2.0, bar2Angle + dt*k2[1]/2.0, bar1Velocity + dt*k2[2]/2.0, bar2Velocity + dt*k2[3]/2.0, bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia);
		let k4 = this.dynamicStep(bar1TorqueInput, bar1Angle + dt*k3[0],     bar2Angle + dt*k3[1],     bar1Velocity + dt*k3[2],     bar2Velocity + dt*k3[3],     bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia);

		this.bar1Angle += dt*(k1[0] + 2.0*k2[0] + 2.0*k3[0] + k4[0])/6.0;
		this.bar2Angle += dt*(k1[1] + 2.0*k2[1] + 2.0*k3[1] + k4[1])/6.0;
		this.bar1Velocity += dt*(k1[2] + 2.0*k2[2] + 2.0*k3[2] + k4[2])/6.0;
		this.bar2Velocity += dt*(k1[3] + 2.0*k2[3] + 2.0*k3[3] + k4[3])/6.0;

	}



	update(bar1TorqueInput, bar1Angle, bar2Angle, bar1Velocity, bar2Velocity, bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia) {


		this.bar1TorqueInput = bar1TorqueInput;

		this.bar1Angle = bar1Angle;
		this.bar2Angle = bar2Angle;
		this.bar1Velocity = bar1Velocity;
		this.bar2Velocity = bar2Velocity;


		this.bar1SpringConstant = bar1SpringConstant;
		this.bar1Friction = bar1Friction;
		this.bar1Inertia = bar1Inertia;
		this.bar2SpringConstant = bar2SpringConstant;
		this.bar2Friction = bar2Friction;
		this.bar2Inertia = bar2Inertia;


		this.rkStep(bar1TorqueInput, bar1Angle, bar2Angle, bar1Velocity, bar2Velocity, bar1SpringConstant, bar1Friction, bar1Inertia, bar2SpringConstant, bar2Friction, bar2Inertia, this.dt/this.RK_STEPS)

	}


	load() {
		loadModel('images/system9/knob.obj', (x) => {
			this.knobModel = x;
		});

		loadModel('images/system9/bar1.obj', (x) => {
			this.bar1Model = x;
		});

		loadModel('images/system9/bar2.obj', (x) => {
			this.bar2Model = x;
		});

	}



	drawBlocks() {

	    var pixelScale = 35;
	    var angleScale = 1.0;


	    let blockWidth = 150;
	    let blockHeight = 15;


		camera(0, -30, width/8, 0, -30, 0, 0, 1, 0);


		let refAng = angleScale*this.bar1TorqueInput/pixelScale;
		let bar1Ang = angleScale*this.bar1Angle/pixelScale;
		let bar2Ang = angleScale*this.bar2Angle/pixelScale;


		push();
		noStroke();
		stroke(0.8*255, 0.16*255, 0.16*255);
		translate(150, 0, 0);
		rotateZ(bar1Ang);
		translate(-150, 0, 0);
		rect(0, -blockHeight/2, blockWidth, blockHeight);
		pop();


	    push();
	    noStroke();
	    stroke(0.3*255, 0.8*255, 0.2*255);
	    translate(150-150*Math.cos(bar1Ang), -150*Math.sin(bar1Ang), 0);
	    rotateZ(bar2Ang);
		rect(-blockWidth, -blockHeight/2, blockWidth, blockHeight);
	    pop();


	    push();
	    noStroke();
	    stroke('blue');
	    translate(150, 0, 0);
	    rotateZ(refAng);
	    translate(-150, 0, 0);
	    circle(150, 0, 30);
	    line(150, 0, 150-30,0);
	    pop();


	    push();
	    noFill();
	    stroke('red');
	    translate(150, 0, 0);
		if (bar1Ang>0)
	    	arc(0,0, 40, 40, PI, PI + bar1Ang);
		else
			arc(0,0, 40, 40, PI + bar1Ang, PI);
	    stroke('red');
		line(0, 0, -30, 0)
	    rotateZ(bar1Ang);
		line(0, 0, -30, 0)
	    pop();




	    push();
	    noFill();
	    stroke('green');
	    translate(150-150*Math.cos(bar1Ang), -150*Math.sin(bar1Ang), 0);
		if (bar2Ang>0)
	    	arc(0,0, 40, 40, PI, PI + bar2Ang);
		else
			arc(0,0, 40, 40, PI + bar2Ang, PI);
	    stroke('green');
		line(0, 0, -30, 0)
	    rotateZ(bar2Ang);
		line(0, 0, -30, 0)
	    pop();




	}



	drawImages(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.knobModel && this.bar1Model && this.bar2Model ) {

			fill(255);


			if (this.bar1TorqueInput === undefined) {
				this.bar1TorqueInput = 0.0;
			}

			if (this.bar1Angle === undefined) {
				this.bar1Angle = 0.0;
			}

			if (this.bar2Angle === undefined) {
				this.bar2Angle = 0.0;
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


			let refAng = angleScale*this.bar1TorqueInput/pixelScale;
			let bar1Ang = angleScale*this.bar1Angle/pixelScale;
			let bar2Ang = angleScale*this.bar2Angle/pixelScale;


		    push();
		    noStroke();
		    ambientMaterial(0.8*255, 0.16*255, 0.16*255);
		    translate(8, 0, 0);
		    rotateZ(-bar1Ang);
		    translate(-8, 0, 0);
		    model(this.bar1Model);
		    pop();

		    push();
		    noStroke();
		    ambientMaterial(0.3*255, 0.8*255, 0.2*255);
		    translate(8-8*Math.cos(bar1Ang), 8*Math.sin(bar1Ang), 0);
		    rotateZ(-bar2Ang);
		    model(this.bar2Model);
		    pop();


		    push();
		    noStroke();
		    ambientMaterial('blue');
		    translate(8, 0, 0);
		    rotateZ(-refAng);
		    translate(-8, 0, 0);
		    model(this.knobModel);
		    pop();



		    drawSpiralVector([8, 0, 6], [8, 0, 0], 0.8, - 2*2*Math.PI - bar1Ang, refAng, 60, 2);


		    pop();


		}

	}



	draw(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.drawingBlocks) this.drawBlocks();

		if (this.drawingImages) this.drawImages(cameraTeta, cameraPhi, dist);
		
	}





}