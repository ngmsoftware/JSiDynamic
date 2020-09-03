
class MechanicalRotatory {


	constructor(canvas, dt) {
		this.scale = 0.5;

		this.canvas = canvas;

		this.dt = dt;

		this.angInput = 0.0;
		this.angBlock1 = 0.0;
		this.angBlock2 = 0.0;
		this.angBlock3 = 0.0;
		this.velBlock1 = 0.0;
		this.velBlock2 = 0.0;
		this.velBlock3 = 0.0;

		this.block1Inertia = 0.5;
		this.block2Inertia = 0.5;
		this.block3Inertia = 0.5;
		this.Constant = 0.5;
		this.spring2Constant = 0.5;
		this.block1Friction = 0.5;
		this.block2Friction = 0.5;

		this.drawingImages = false;
		this.drawingBlocks = true;
	}


	update( angInput, angBlock1, angBlock2, angBlock3, velInput, velBlock1, velBlock2, velBlock3, block1Inertia, block2Inertia, block3Inertia,  spring1Constant, spring2Constant, block1Friction, block2Friction) {
		this.angInput = angInput;
		this.angBlock1 = angBlock1;
		this.angBlock2 = angBlock2;
		this.angBlock3 = angBlock3;
		this.velBlock1 = velBlock1;
		this.velBlock2 = velBlock2;
		this.velBlock3 = velBlock3;

		this.block1Inertia = block1Inertia;
		this.block2Inertia = block2Inertia;
		this.block3Inertia = block3Inertia;
		this.spring1Constant = spring1Constant;
		this.spring2Constant = spring2Constant;
		this.block1Friction = block1Friction;
		this.block2Friction = block2Friction;


		var torque3 = this.spring2Constant*(this.angBlock2 - this.angBlock3);

		var torque1 = this.spring1Constant*(this.angInput - this.angBlock1) - (this.block1Friction + 9*this.block2Friction)*this.velBlock1 + 3*torque3;

		this.velBlock1 += (torque1/this.block1Inertia)*this.dt;
		this.velBlock3 += (torque3/this.block3Inertia)*this.dt;

		this.angBlock1 += this.velBlock1*this.dt;
		this.angBlock2 = -3*this.angBlock1;
		this.angBlock3 += this.velBlock3*this.dt;

	}


	load() {
		loadModel('images/system2/gear_3.obj', (x) => {
			this.block1Model = x;
		});
		loadModel('images/system2/gear_1.obj', (x) => {
			this.block2Model = x;
		});

		loadModel('images/system2/input.obj', (x) => {
			this.inputModel = x;
		});


		loadModel('images/system2/axis.obj', (x) => {
			this.axisModel = x;
		});

		loadModel('images/system2/helix.obj', (x) => {
			this.block3Model = x;
		});

		loadModel('images/system2/break1.obj', (x) => {
			this.break1Model = x;
		});
		loadModel('images/system2/break2.obj', (x) => {
			this.break2Model = x;
		});

	}



	drawBlocks() {

	    var pixelScale = 35;


		camera(0, -30, width/8, 0, -30, 0, 0, 1, 0);

		fill(255);
		stroke(0,0,255);
		rect(-width/2 + width/3, -20, 20, 40);



		fill(255);
		stroke('yellow');
		rect(-40, -40, 20, 80);



		fill(0);
		stroke(0);
		rect(-2, -40, 4, 78);



		fill(0);
		stroke(0);
		rect(-2, -67, 4, 25);


		fill(255);
		stroke('green');
		rect(20, -67, 20, 27);



		fill(255);
		stroke('red');
		rect(width/2 - width/3 -10, -67, 20, 27);


		stroke('black');
		drawSpiral(-width/2 + width/3 + 10, 0, 0, 2, this.angInput/pixelScale, this.angBlock1/pixelScale, 100);


		drawSpiral(0, 200, -55, 2, this.angBlock2/pixelScale, this.angBlock3/pixelScale, 100);

	}



	drawImages(cameraTeta = 0, cameraPhi = 0, dist = NaN) {


		if (this.block1Model && this.block2Model && this.block3Model && this.break1Model && this.break2Model && this.inputModel && this.axisModel) {

			fill(255);

		    var pixelScale = 35;
		    var angleScale = 0.3;

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


			var fov = PI/12;
			var cameraZ = (height/2.0) / tan(fov/2.0);
			perspective(fov,width/height, cameraZ/10.0, cameraZ*10.0);	

			directionalLight(255,255,255, 0, -10, -5);
			pointLight(255,255,255, 0, -100, -50);
			ambientLight(55,55,55);


			let y0 = -2;

		    push();
		    var s = pixelScale;
		    noStroke();
		    ambientMaterial(200);
		    scale(s,-s,s);
		    translate(-4, 4+y0, 0);
		    rotateX(angleScale*this.angBlock2/pixelScale);
		    model(this.axisModel);
		    pop();


//			fill(200,pow(this.block1Friction,0.1)*255);
//			stroke(100,pow(this.block1Friction,0.1)*255);
		    noStroke();
		    ambientMaterial(pow(1-this.block1Friction,0.1)*255);
		    push();
		    var s = (1 + .6*this.block1Inertia);
		    scale(pixelScale*s,-pixelScale,pixelScale);
		    translate(-4/s, -3+y0, 0);
		    model(this.break1Model);
		    pop();


//			fill(200,pow(this.block2Friction,0.1)*255);
//			stroke(100,pow(this.block2Friction,0.1)*255);
		    noStroke();
		    ambientMaterial(pow(1-this.block2Friction,0.1)*255);
		    push();
		    var s = (1 + 1.2*this.block2Inertia);
		    scale(pixelScale*s,-pixelScale,pixelScale);
		    translate(-4/s, 5+y0, 0);
		    model(this.break2Model);
		    pop();




//			fill(255);
//			stroke('blue');
		    noStroke();
		    ambientMaterial(100,100,255);
		    push();
		    var s = pixelScale;
		    scale(s,-s,s);
		    translate(-10, y0, 0);
		    rotateX(angleScale*this.angInput/pixelScale);
		    model(this.inputModel);
		    pop();


//			stroke('yellow');
		    noStroke();
		    ambientMaterial('yellow');
		    push();
		    var s = (1 + 2*this.block1Inertia);
		    scale(pixelScale*s,-pixelScale,pixelScale);
		    translate(-4/s, y0, 0);
		    rotateX(angleScale*this.angBlock1/pixelScale);
		    model(this.block1Model);
		    pop();

//			stroke('green');
		    noStroke();
		    ambientMaterial(100,255,100);
		    push();
		    var s = (1 + 2*this.block2Inertia);
		    scale(pixelScale*s,-pixelScale,pixelScale);
		    translate(-4/s, 4+y0,0);
		    rotateX(angleScale*this.angBlock2/pixelScale);
		    model(this.block2Model);
		    pop();

//			stroke('red');
		    noStroke();
		    ambientMaterial('red');
		    push();
		    var s = (1 + this.block3Inertia/5);
		    scale(pixelScale*s,-pixelScale,pixelScale);
		    translate(6/s, 4+y0, 0);
		    rotateX(angleScale*this.angBlock3/pixelScale);
		    model(this.block3Model);
		    pop();




			stroke(0);
		    scale(pixelScale,-pixelScale,pixelScale);
		    drawSpiral(-10, -4, y0, 0.5, angleScale*this.angInput/pixelScale, angleScale*this.angBlock1/pixelScale, 40, 3);

		    drawSpiral(-3.5, 6, 4+y0, 0.4, angleScale*this.angBlock2/pixelScale, angleScale*this.angBlock3/pixelScale, 40, 3);

		    pop();

		}

	}



	draw(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.drawingBlocks) this.drawBlocks();

		if (this.drawingImages) this.drawImages(cameraTeta, cameraPhi, dist);
		
	}





}