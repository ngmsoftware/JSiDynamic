
class MechanicalPlanar {


	constructor(canvas, dt) {


		this.canvas = canvas;

		this.dt = dt;

		this.cartPositionP = 0;
		this.cartPosition = 0;
		this.block1Position = 0;
		this.cartVelocity = 0;
		this.block1Velocity = 0;
		this.block2Position = 0;
		this.block2Velocity = 0;

		this.block1Mass = 1;
		this.cartBlock1SpringConstant = 1;
		this.cartBlock1Friction = 1;
		this.block2Mass = 1;
		this.block1Block2SpringConstant = 1;
		this.block1Block2Friction = 1;

		this.p0x = 0;
		this.p0y = 0;

		this.drawingImages = false;
		this.drawingBlocks = false;
		this.drawingAxis = true;
	}


	update(cartPosition, block1Position, block2Position, block1Mass, block2Mass, cartBlock1SpringConstant, block1Block2SpringConstant, cartBlock1Friction, block1Block2Friction) {
		this.cartPosition = cartPosition;
		this.block1Position = block1Position;
		this.block2Position = block2Position;

		this.block1Mass = block1Mass;
		this.cartBlock1SpringConstant = cartBlock1SpringConstant;
		this.cartBlock1Friction = cartBlock1Friction;
		this.block2Mass = block2Mass;
		this.block1Block2SpringConstant = block1Block2SpringConstant;
		this.block1Block2Friction = block1Block2Friction;


		this.block1Velocity += this.dt*(this.cartBlock1SpringConstant*(this.cartPosition - this.block1Position) + this.block1Block2SpringConstant*(this.block2Position - this.block1Position)  + this.cartBlock1Friction*(this.cartVelocity - this.block1Velocity))/this.block1Mass;
		this.block1Position += this.dt*this.block1Velocity;


		this.block2Velocity += this.dt*(this.block1Block2SpringConstant*(this.block1Position - this.block2Position) + this.block1Block2Friction*(this.block1Velocity - this.block2Velocity))/this.block2Mass;
		this.block2Position += this.dt*this.block2Velocity;

		this.cartVelocity = (this.cartPosition - this.cartPositionP)/this.dt;
		this.cartPositionP = this.cartPosition;

	}


	load() {
		loadModel('images/system6/dumperFix.obj', (x) => {
			this.dumperFixModel = x;
		});
		loadModel('images/system6/dumperPiston.obj', (x) => {
			this.dumperPistonModel = x;
		});
		loadModel('images/system6/cart.obj', (x) => {
			this.cartModel = x;
		});
		loadModel('images/system6/tire.obj', (x) => {
			this.tireModel = x;
		});
		loadModel('images/system6/block.obj', (x) => {
			this.blockModel = x;
		});
		loadModel('images/system6/spring.obj', (x) => {
			this.springModel = x;
		});
		loadFont('images/inconsolata.ttf', (x) => {
			this.fontRegular = x;
		});

	}



	drawBlocks() {

		var s1 = (0.75 + this.block1Mass);
		var s2 = (0.75 + this.block2Mass);

		var y1 = map(this.block1Mass, 0, 1, 7, 32);
		var y2 = map(this.block2Mass, 0, 1, 7, 32);

		var _block2Width = 50*s2;
		var _block2Height = 50*s2;
		var _block1Width = 50*s1;
		var _block1Height = 50*s1;
		var _cartWidth = 250;
		var _cartHeight = 50;
		var _tireWidth = 30;

		camera(0, 0, width/8, 0, 0, 0, 0, 1, 0);

		fill(255);
		stroke('red');
		rect(this.block1Position - _block1Width/2, -_block1Height/2 - y1, _block1Width, _block1Height);

		fill(255);
		stroke('green');
		rect(this.block2Position - _block2Width/2 + _cartWidth/2, -_block2Height/2 - y2, _block2Width, _block2Height);

		stroke('blue');
		rect(this.cartPosition - _cartWidth/2, _cartHeight/4, _cartWidth*1.5, _cartHeight/4);
		rect(this.cartPosition - _cartWidth/2, -_cartHeight/2, _cartWidth/20, _cartHeight);

		ellipse(this.cartPosition-_cartWidth/8, _tireWidth, _tireWidth);
		ellipse(this.cartPosition+3*_cartWidth/4, _tireWidth, _tireWidth);


		stroke(0, 255*this.cartBlock1SpringConstant);
		drawSpring(this.cartPosition, this.block1Position, _cartWidth, _block1Width, 0, 150);
		stroke(0, 255*this.block1Block2SpringConstant);
		drawSpring(this.block1Position+_cartWidth/2+_block1Width/2-13, this.block2Position+_cartWidth/2, _cartWidth, _block2Width, 0, 150);

		stroke(0, 255*this.cartBlock1Friction);
		drawDumper(this.cartPosition, this.block1Position, _cartWidth, _block1Width, -20);
		stroke(0, 255*this.block1Block2Friction);
		drawDumper(this.block1Position+_cartWidth/2+_block1Width/2-13, this.block2Position+_cartWidth/2, _cartWidth, _block2Width, -20);

	}



	drawImages(cameraTeta = 0, cameraPhi = 0, dist = NaN) {


		if (this.tireModel && this.blockModel && this.springModel && this.cartModel && this.dumperFixModel && this.dumperPistonModel) {

			fill(255);

		    var pixelScale = 35;

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


			directionalLight(255,255,255, 0, -10, -5);
			pointLight(255,255,255, 0, -100, -50);
			ambientLight(55,55,55);


			var fov = PI/12;
			var cameraZ = (height/2.0) / tan(fov/2.0);
			perspective(fov,width/height, cameraZ/10.0, cameraZ*10.0);	


			let y0 = -5;


			let y1 = map(this.block2Mass, 0.04,1, 15,-20);
//			stroke('red');
		    noStroke();
		    ambientMaterial('green');
		    push();
		    var s = pixelScale*(0.4+this.block2Mass);
		    translate(this.block2Position+100, -40+y0+y1, 0);
		    scale(pixelScale,s,pixelScale);
		    model(this.blockModel);
		    pop();


			let y2 = map(this.block1Mass, 0.04,1, 15,-20);
//			stroke('red');
		    noStroke();
		    ambientMaterial('red');
		    push();
		    var s = pixelScale*(0.4+this.block1Mass);
		    translate(this.block1Position - 100, -40+y0+y2, 0);
		    scale(pixelScale,s,pixelScale);
		    model(this.blockModel);
		    pop();








//			stroke('blue');
		    noStroke();
		    ambientMaterial('blue');
		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.cartPosition/pixelScale, 0, 0);
		    model(this.cartModel);
		    pop();






//			stroke(0, 255*this.cartBlock1SpringConstant);
		    noStroke();
		    ambientMaterial(255*(1-this.cartBlock1SpringConstant));
		    push();
		    translate((this.cartPosition + this.block1Position - 400)/2, -25+y0, 0);
		    s = pixelScale;
		   	var factor = 1 + 0.005*(this.block1Position - this.cartPosition);
		    scale(s*factor,-s,s);
		    model(this.springModel);
		    pop();






//			stroke(0, 255*this.cartBlock1SpringConstant);
		    noStroke();
		    ambientMaterial(126,40,255*(1-this.cartBlock1Friction));
		    push();
		    translate(this.cartPosition - 180 , -25+y0, 0);
		    s = pixelScale;
		    scale(s,-s,s);
		    model(this.dumperPistonModel);
		    pop();

//			stroke(0, 255*this.cartBlock1SpringConstant);
		    noStroke();
		    ambientMaterial(126,40,255*(1-this.cartBlock1Friction));
		    push();
		    translate(this.block1Position - 200 , -25+y0, 0);
		    s = pixelScale;
		    scale(s,-s,s);
		    model(this.dumperFixModel);
		    pop();
















//			stroke(0, 255*this.cartBlock1SpringConstant);
		    noStroke();
		    ambientMaterial(255*(1-this.block1Block2SpringConstant));
		    push();
		    translate((this.block1Position + this.block2Position)/2, -25+y0, 0);
		    s = pixelScale;
		   	var factor = 1 + 0.005*(this.block2Position - this.block1Position);
		    scale(s*factor,-s,s);
		    model(this.springModel);
		    pop();






//			stroke(0, 255*this.cartBlock1SpringConstant);
		    noStroke();
		    ambientMaterial(126,40,255*(1-this.block1Block2Friction));
		    push();
		    translate(this.block1Position+10 , -25+y0, 0);
		    s = pixelScale;
		    scale(s,-s,s);
		    model(this.dumperPistonModel);
		    pop();

//			stroke(0, 255*this.cartBlock1SpringConstant);
		    noStroke();
		    ambientMaterial(126,40,255*(1-this.block1Block2Friction));
		    push();
		    translate(this.block2Position , -25+y0, 0);
		    s = pixelScale;
		    scale(s,-s,s);
		    model(this.dumperFixModel);
		    pop();










//			stroke('blue');
		    noStroke();
		    ambientMaterial(200);

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.cartPosition/pixelScale -4, -0.5, -1.2);
		    rotateZ(-this.cartPosition/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.cartPosition/pixelScale -4, -0.5, 1.2);
		    rotateZ(-this.cartPosition/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.cartPosition/pixelScale +4, -0.5, -1.2);
		    rotateZ(-this.cartPosition/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.cartPosition/pixelScale +4, -0.5, 1.2);
		    rotateZ(-this.cartPosition/30);
		    model(this.tireModel);
		    pop();








//			stroke('blue');
		    noStroke();
		    ambientMaterial(200);

		    let x1 = -5.8;
		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block1Position/pixelScale -0.85+x1, 0.64, -1.7);
		    rotateZ(-(this.block1Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block1Position/pixelScale -0.85+x1, 0.64, 1.7);
		    rotateZ(-(this.block1Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block1Position/pixelScale +0.85+x1, 0.64, -1.7);
		    rotateZ(-(this.block1Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block1Position/pixelScale +0.85+x1, 0.64, 1.7);
		    rotateZ(-(this.block1Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();




//			stroke('blue');
		    noStroke();
		    ambientMaterial(200);

		    let x2 = 5.8;
		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block2Position/pixelScale -0.85+x2, 0.64, -1.7);
		    rotateZ(-(this.block2Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block2Position/pixelScale -0.85+x2, 0.64, 1.7);
		    rotateZ(-(this.block2Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block2Position/pixelScale +0.85+x2, 0.64, -1.7);
		    rotateZ(-(this.block2Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.block2Position/pixelScale +0.85+x2, 0.64, 1.7);
		    rotateZ(-(this.block2Position-this.cartPosition)/15);
		    model(this.tireModel);
		    pop();



		    pop();
		}

	}



	drawAxis() {

		if (this.fontRegular) {

			camera(0, -20, width/8, 0, -20, 0, 0, 1, 0);


			var v0 = createVector(0, 50);
			var v1 = createVector(0, -100);
			var v2 = createVector(-20, 0);
			var v3 = createVector(100, 0);
			drawArrow(v0, v1, 'black', 2);
			drawArrow(v2, v3, 'black', 2);


			v0 = createVector(this.cartPosition, 50);
			v1 = createVector(0, -100);
			v2 = createVector(this.cartPosition-20, 0);
			v3 = createVector(100, 0);
			drawArrow(v0, v1, 'blue', 2);
			drawArrow(v2, v3, 'blue', 2);

			v0 = createVector(this.block1Position, 50);
			v1 = createVector(0, -100);
			v2 = createVector(this.block1Position-20, 20);
			v3 = createVector(100, 0);
			drawArrow(v0, v1, 'red', 2);
			drawArrow(v2, v3, 'red', 2);



			v0 = createVector(this.block2Position, 10);
			v1 = createVector(0, -100);
			v2 = createVector(this.block2Position-20, -20);
			v3 = createVector(100, 0);
			drawArrow(v0, v1, 'green', 2);
			drawArrow(v2, v3, 'green', 2);



			textSize(15);
			fill('blue');
			textFont(this.fontRegular);
			text(this.cartPosition.toFixed(2), this.cartPosition+10, -5);
			fill('red');
			text(this.block1Position.toFixed(2), this.block1Position+10, 15);
			fill('green');
			text(this.block2Position.toFixed(2), this.block2Position+10, -20);

		}

	}


	draw(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.drawingBlocks) this.drawBlocks();

		if (this.drawingImages) this.drawImages(cameraTeta, cameraPhi, dist);

		if (this.drawingAxis) this.drawAxis();
		
	}



}