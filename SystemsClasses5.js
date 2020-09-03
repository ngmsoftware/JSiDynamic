
class MechanicalPlanar {


	constructor(canvas, dt) {


		this.canvas = canvas;

		this.dt = dt/5;

		this.inputForce = 0;
		this.cartPosition = 0;
		this.ballAngle = 0;
		this.cartVelocity = 0;
		this.cartAcceleration = 0;
		this.ballAngularVelocity = 0;
		this.ballAngularAcceleration = 0;

		this.ballMass = 1;
		this.cartMass = 1;
		this.gravity = 1;

		this.p0x = 0;
		this.p0y = 0;

		this.drawingImages = false;
		this.drawingBlocks = true;

		this.time = 0;

		this.NCompute = 100;


		this.x1 = 0
		this.x2 = 0;
		this.x3 = 0;
		this.x4 = 0;
	}


	f(x, M, m, l, g, b, F) {
		var k = m*l*x[3]*x[3]*sin(x[2]);
		var d = M + m - m*cos(x[2])*cos(x[2]);

		var x1p = x[1];
		var x2p = (F -b*x[1] - k + m*g*sin(x[2])*cos(x[2]))/d;
		var x3p = x[3];
		var x4p = g*sin(x[2])/l + cos(x[2])*(F -b*x[1] - k + g*sin(x[2])*cos(x[2]))/(l*d);

		return [x1p, x2p, x3p, x4p];
	}



	compute( inputForce, cartPosition, ballAngle, cartMass, ballMass, cartFriction, length, gravity ) {
		this.time += this.dt;

		this.inputForce = inputForce;
		this.cartPosition = cartPosition;

		this.ballMass = ballMass;
		this.cartMass = cartMass;
		this.cartFriction = cartFriction;
		this.gravity = gravity;
		this.length = length;



		var opp = this.ballAngularAcceleration;
		var xpp = this.cartAcceleration;
		var op = this.ballAngularVelocity;
		var xp = this.cartVelocity;
		var x = this.cartPosition;
		var o = this.ballAngle;
		var m = this.ballMass;
		var M = this.cartMass;
		var l = this.length;
		var g = this.gravity;
		var F = -this.inputForce;
		var b = this.cartFriction;
		var dt = this.dt/this.NCompute;

		var x1 = this.x1;
		var x2 = this.x2;
		var x3 = this.x3;
		var x4 = this.x4;


		var k1 = this.f([x1             , x2             , x3             , x4             ], M, m, l, g, b, F);
		var k2 = this.f([x1 + dt*k1[0]/2, x2 + dt*k1[1]/2, x3 + dt*k1[2]/2, x4 + dt*k1[3]/2], M, m, l, g, b, F);
		var k3 = this.f([x1 + dt*k2[0]/2, x2 + dt*k2[1]/2, x3 + dt*k2[2]/2, x4 + dt*k2[3]/2], M, m, l, g, b, F);
		var k4 = this.f([x1 + dt*k3[0]  , x2 + dt*k3[1]  , x3 + dt*k3[2]  , x4 + dt*k3[3]  ], M, m, l, g, b, F);


		this.x1 += (1/6)*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0])*dt;
		this.x2 += (1/6)*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1])*dt;
		this.x3 += (1/6)*(k1[2] + 2*k2[2] + 2*k3[2] + k4[2])*dt;
		this.x4 += (1/6)*(k1[3] + 2*k2[3] + 2*k3[3] + k4[3])*dt;

		if (this.x3 > PI)
			this.x3 -= 2*PI;
		if (this.x3 < -PI)
			this.x3 += 2*PI;

		this.cartPosition = this.x1;
		this.ballAngle = this.x3;

	}


	// compute2( inputForce, cartPosition, ballAngle, cartMass, ballMass, cartFriction, length, gravity ) {
	// 	this.time += this.dt;

	// 	this.inputForce = inputForce;
	// 	this.cartPosition = cartPosition;

	// 	this.ballMass = ballMass;
	// 	this.cartMass = cartMass;
	// 	this.cartFriction = cartFriction;
	// 	this.gravity = gravity;
	// 	this.length = length;



	// 	var opp = this.ballAngularAcceleration;
	// 	var xpp = this.cartAcceleration;
	// 	var op = this.ballAngularVelocity;
	// 	var xp = this.cartVelocity;
	// 	var x = this.cartPosition;
	// 	var o = this.ballAngle;
	// 	var m = this.ballMass;
	// 	var M = this.cartMass;
	// 	var l = this.length;
	// 	var g = this.gravity;
	// 	var F = this.inputForce;
	// 	var b = this.cartFriction;
	// 	var dt = this.dt/this.NCompute;


	// 	this.cartAcceleration = (F - m*l*opp*cos(o) + m*l*op*op*sin(o))/(M+m) - b*xp/M;
	// 	this.ballAngularAcceleration = (-xpp*cos(o) + g*sin(o))/l;

	// //	console.log(this.cartAcceleration, this.ballAngularAcceleration);

	// 	this.cartVelocity += this.cartAcceleration*dt;
	// 	this.ballAngularVelocity += this.ballAngularAcceleration*dt;

	// 	this.cartPosition += this.cartVelocity*dt;		
	// 	this.ballAngle += this.ballAngularVelocity*dt;

	// }






	update( inputForce, cartPosition, ballAngle, cartMass, ballMass, cartFriction, length, gravity ) {

		for (var i = 0; i < 2*this.NCompute; i++) {
			this.compute( inputForce, cartPosition, ballAngle, cartMass, ballMass, cartFriction, length, gravity );
		}
	}


	load() {
		loadFont('images/inconsolata.ttf', (x) => {
			this.fontRegular = x;
		});
		loadModel('images/system5/pole.obj', (x) => {
			this.poleModel = x;
		});
		loadModel('images/system5/track.obj', (x) => {
			this.trackModel = x;
		});
		loadModel('images/system5/pole_axis.obj', (x) => {
			this.poleAxisModel = x;
		});
		loadModel('images/system5/weels.obj', (x) => {
			this.weelsModel = x;
		});

		loadModel('images/system5/ball.obj', (x) => {
			this.ballModel = x;
		});
	}



	drawBlocks() {

		fill(255);

	    var pixelScale = 35;

	    push();
		camera(0, 0, width/2, 0, 0, 0, 0, 1, 0);

		var fov = PI/12;
		var cameraZ = (height/2.0) / tan(fov/2.0);
		perspective(fov,width/height, cameraZ/10.0, cameraZ*10.0);	

		drawGround(-width/6, width/6, height/4.3, 'black', 2, 30, 6);


		textSize(15);
		textFont(this.fontRegular);


		var s = 1+this.cartMass/5;

		var maxL = 100;

		var cartW = 60*s;
		var cartH = 30*pow(s,0.5);
		var r = 17;
		var y = 30 - (this.cartMass-0.5)*2.8;
		var x = -this.cartPosition*maxL;

		rect(x,y, cartW, cartH);

		circle(x+1.1*r,y+cartH, r);

		circle(x + cartW - 1.1*r,y+cartH, r);

		var ballX = x+cartW/2 + maxL*this.length*sin(this.ballAngle);
		var ballY = y - maxL*this.length*cos(this.ballAngle)

		circle(ballX,ballY, r*(.7+this.ballMass));

		line(x+cartW/2, y, ballX, ballY);


		strokeWeight(1);
		stroke('red');


		line(x+cartW/2, y+maxL, x+cartW/2, y - maxL);

		var ang = this.ballAngle;
		if (ang>PI) ang -= 2*PI;

		if (ang > 0 ){
			arc(x+cartW/2, y, 2*r, 2*r, -PI/2, this.ballAngle-PI/2);
			fill('red');
			text((this.ballAngle).toFixed(2), x + cartW/2 + r*cos(this.ballAngle/2-PI/2), y + r*sin(this.ballAngle/2-PI/2));
			noFill();
		} 
		if (ang < 0)  {
			arc(x+cartW/2, y, 2*r, 2*r, this.ballAngle-PI/2, -PI/2);
			fill('red');
			text((this.ballAngle).toFixed(2), -50 + x + cartW/2 + r*cos(this.ballAngle/2-PI/2), y + r*sin(this.ballAngle/2-PI/2));
			noFill();
		}

		if (this.inputForce < 0) {
			drawArrow(createVector(x, y+cartH/2), createVector(this.inputForce*width/32,0), 'blue', 3);
		}
		if (this.inputForce > 0) {
			drawArrow(createVector(x+cartW, y+cartH/2), createVector(this.inputForce*width/32,0), 'blue', 3);
		}





		strokeWeight(1);
		stroke('green');

		line(0,y-10, x, y-10);
		line(0,y-5, 0, y-15);
		line(x,y-5, x, y-15);

		fill('green');
		text((-this.cartPosition).toFixed(2), -this.cartPosition*maxL/2, y+3);


	}



	drawImages(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

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


//			camera(200, -height/6, width/6, 0, -10, 0, 0, 1, 0);
			var fov = PI/12;
			var cameraZ = (height/2.0) / tan(fov/2.0);
			perspective(fov,width/height, cameraZ/10.0, cameraZ*10.0);	



		var maxL = 100;


	    fill(255);
//	    stroke(0);
	    noStroke();
	    ambientMaterial(200);
	    push();
	    translate(-this.cartPosition*maxL, 0, 0);
	    var s = pixelScale/10;
	    rotateZ(this.ballAngle);
	    scale(s,-s*this.length,s);
	    model(this.poleModel);
	    pop();


	    fill(255);
//	    stroke(0);
	    noStroke();
	    ambientMaterial(200);
	    push();
	    translate(-this.cartPosition*maxL, 0, 0);
	    var s = pixelScale/10;
	    scale(s,-s,s);
	    rotateZ(-this.ballAngle);
	    model(this.poleAxisModel);
	    pop();


	    fill(255);
//	    stroke('green');
	    noStroke();
	    ambientMaterial('green');
	    push();
	    translate(-this.cartPosition*maxL, 0, 0);
	    var s = pixelScale/10;
	    scale(s,-s,s);
	    rotateZ(this.cartPosition*4);
	    model(this.weelsModel);
	    pop();


	    fill(255);
	    noStroke();
	    ambientMaterial('red');
	    push();
	    var sx = 2*(0.6+this.ballMass)*pixelScale/10;
	    var sy = 2*(0.6+this.ballMass)*pixelScale/10;
	    var sz = pixelScale/10;
	    translate(-this.cartPosition*maxL, 0, 0);
	    rotateZ(this.ballAngle);
	    scale(sx,-sy,sz);
	    translate(0,0.48*this.length*maxL/sx, 0);
	    model(this.ballModel);
	    pop();


	    fill(255);
	    noStroke();
	    push();
	    var s = pixelScale/10;
	    scale(s,-s,s);
	    model(this.trackModel);
	    pop();


	    pop();

	}




	draw(cameraTeta = 0, cameraPhi = 0, dist = NaN) {

		if (this.poleModel && this.trackModel && this.poleAxisModel && this.ballModel && this.fontRegular && this.weelsModel) {

			if (this.drawingBlocks) this.drawBlocks();

			if (this.drawingImages) this.drawImages(cameraTeta, cameraPhi, dist);
		}
	}



}