
class MechanicalPlanar {


	constructor(canvas, dt) {


		this.canvas = canvas;

		this.dt = dt;

		this.posCartP = 0;
		this.posCart = 0;
		this.posBlock = 0;
		this.velCart = 0;
		this.velBlock = 0;

		this.blockMass = 1;
		this.springConstant = 1;
		this.blockFriction = 1;

		this.p0x = 0;
		this.p0y = 0;

		this.drawingImages = false;
		this.drawingBlocks = false;
		this.drawingAxis = true;
	}


	update( posCart, posBlock, velCart, velBlock, blockMass, springConstant, blockFriction) {
		this.posCart = posCart;
		this.posBlock = posBlock;
		this.velCart = velCart;
		this.velBlock = velBlock;

		this.blockMass = blockMass;
		this.springConstant = springConstant;
		this.blockFriction = blockFriction;


		this.velBlock += this.dt*(this.springConstant*(this.posCart - this.posBlock) + this.blockFriction*(this.velCart - this.velBlock))/this.blockMass;
		this.posBlock += this.dt*this.velBlock;

		this.velCart = (this.posCart - this.posCartP)/this.dt;

		this.posCartP = this.posCart;
	}


	load() {
		loadModel('images/system1/cart.obj', (x) => {
			this.cartModel = x;
		});
		loadModel('images/system1/tire.obj', (x) => {
			this.tireModel = x;
		});
		loadModel('images/system1/block.obj', (x) => {
			this.blockModel = x;
		});
		loadModel('images/system1/spring.obj', (x) => {
			this.springModel = x;
		});
		loadFont('images/inconsolata.ttf', (x) => {
			this.fontRegular = x;
		});

	}



	drawBlocks() {

		var s = (0.45 + this.blockMass);

		var y = map(this.blockMass, 0, 1, 0, 24);

		var _blockWidth = 50*s;
		var _blockHeight = 50*s;
		var _cartWidth = 250;
		var _cartHeight = 50;
		var _tireWidth = 30;

		camera(0, 0, width/8, 0, 0, 0, 0, 1, 0);

		fill(255);
		stroke(255,0,0);
		rect(this.posBlock - _blockWidth/2, -_blockHeight/2 - y, _blockWidth, _blockHeight);

		stroke(0,0,255);
		rect(this.posCart - _cartWidth/2, _cartHeight/4, _cartWidth, _cartHeight/4);
		rect(this.posCart - _cartWidth/2, -_cartHeight/2, _cartWidth/20, _cartHeight);

		ellipse(this.posCart-0.4*_cartWidth, _tireWidth, _tireWidth);
		ellipse(this.posCart+0.4*_cartWidth, _tireWidth, _tireWidth);


		stroke(0, 255*this.springConstant);
		drawSpring(this.posCart, this.posBlock, _cartWidth, _blockWidth);
	}



	drawImages(cameraTeta = 0, cameraPhi = 0, dist = NaN) {


		if (this.tireModel && this.blockModel && this.springModel && this.cartModel) {

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


//			stroke('red');
		    noStroke();
		    ambientMaterial('red');
		    push();
		    var s = pixelScale*(0.5+this.blockMass);
			var y = map(s, pixelScale*0.4, pixelScale*1.4, -15, -50) - 10;
		    translate(this.posBlock, y, 0);
		    scale(pixelScale,-s,pixelScale);
		    model(this.blockModel);
		    pop();


//			stroke('blue');
		    noStroke();
		    ambientMaterial('blue');
		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.posCart/pixelScale, 0, 0);
		    model(this.cartModel);
		    pop();


//			stroke(0, 255*this.springConstant);
		    noStroke();
		    ambientMaterial(255*(1-this.springConstant));
		    push();
		    translate((this.posCart + this.posBlock - 200)/2, -25-8, 0);
		    s = pixelScale;
		   	var factor = 1 + 0.005*(this.posBlock - this.posCart);
		    scale(s*factor,-s,s);
		    model(this.springModel);
		    pop();



//			stroke('blue');
		    noStroke();
		    ambientMaterial(200);

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.posCart/pixelScale -4, -0.5 , -1.2);
		    rotateZ(-this.posCart/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.posCart/pixelScale -4, -0.5 , 1.2);
		    rotateZ(-this.posCart/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.posCart/pixelScale +4, -0.5 , -1.2);
		    rotateZ(-this.posCart/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale;
		    scale(s,-s,s);
		    translate(this.posCart/pixelScale +4, -0.5 , 1.2);
		    rotateZ(-this.posCart/30);
		    model(this.tireModel);
		    pop();








//			stroke('blue');
		    noStroke();
		    ambientMaterial(255*(1 - this.blockFriction/0.6));

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.posBlock/pixelScale -0.85, 0.66, -1.7);
		    rotateZ(-(this.posBlock-this.posCart)/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.posBlock/pixelScale -0.85, 0.66, 1.7);
		    rotateZ(-(this.posBlock-this.posCart)/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.posBlock/pixelScale +0.85, 0.66, -1.7);
		    rotateZ(-(this.posBlock-this.posCart)/30);
		    model(this.tireModel);
		    pop();

		    push();
		    s = pixelScale/2;
		    scale(s,-s,s);
		    translate(2*this.posBlock/pixelScale +0.85, 0.66, 1.7);
		    rotateZ(-(this.posBlock-this.posCart)/30);
		    model(this.tireModel);
		    pop();






		    pop();
		}

	}



	drawAxis() {

		if (this.fontRegular) {

			camera(0, 0, width/8, 0, 0, 0, 0, 1, 0);


			var v0 = createVector(0, 50);
			var v1 = createVector(0, -100);
			var v2 = createVector(-20, 0);
			var v3 = createVector(100, 0);
			drawArrow(v0, v1, 'black', 2);
			drawArrow(v2, v3, 'black', 2);


			v0 = createVector(this.posCart, 50);
			v1 = createVector(0, -100);
			v2 = createVector(this.posCart-20, 0);
			v3 = createVector(100, 0);
			drawArrow(v0, v1, 'blue', 2);
			drawArrow(v2, v3, 'blue', 2);

			v0 = createVector(this.posBlock, 50);
			v1 = createVector(0, -100);
			v2 = createVector(this.posBlock-20, 20);
			v3 = createVector(100, 0);
			drawArrow(v0, v1, 'red', 2);
			drawArrow(v2, v3, 'red', 2);

			textSize(15);
			fill('blue');
			textFont(this.fontRegular);
			text(this.posCart.toFixed(2), this.posCart+10, -5);
			fill('red');
			text(this.posBlock.toFixed(2), this.posBlock+10, 15);

		}

	}


	draw(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.drawingBlocks) this.drawBlocks();

		if (this.drawingImages) this.drawImages(cameraTeta, cameraPhi, dist);

		if (this.drawingAxis) this.drawAxis();
		
	}



}