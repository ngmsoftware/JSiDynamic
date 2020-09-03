
class MechanicalPlanar {


	constructor(canvas, dt) {


		this.canvas = canvas;

		this.dt = dt;

		this.inputFlow = 0;
		this.waterLevel = 0;
		this.outputFlow = 0;

		this.reservoirArea = 1;
		this.exitArea = 1;
		this.gravity = 1;

		this.p0x = 0;
		this.p0y = 0;

		this.drawingImages = false;
		this.drawingBlocks = true;

		this.NUM_LEVEL_IMG = 64;
		this.NUM_FLOW_IMG = 13;
		this.NUM_FLOW_IMG_PER_FLOW = 10;

		this.levelImages = [];
		for (var i = 0; i < this.NUM_LEVEL_IMG; i++) {
			this.levelImages.push(0);
		}
		this.flowImages = [];
		for (var i = 0; i < this.NUM_FLOW_IMG; i++) {
			this.flowImages.push([]);
			for (var j = 0; j < this.NUM_FLOW_IMG_PER_FLOW; j++) {
				this.flowImages[i].push(0);
			}
		}
		this.currentFlowImage = 0;
		this.currentLevelImage = 0;

	}


	update( inputFlow, waterLevel, reservoirArea, exitArea, gravity) {

		this.inputFlow = inputFlow;
		this.waterLevel = waterLevel;

		this.reservoirArea = reservoirArea;
		this.exitArea = exitArea;
		this.gravity = gravity;

		this.outputFlow = this.exitArea*sqrt(2*this.gravity*this.waterLevel);

		this.dWater = (this.inputFlow - this.outputFlow)/this.reservoirArea;

		this.waterLevel += this.dWater*this.dt;

		if (this.waterLevel<0.0) this.waterLevel = 0.0;
	}


	load() {

		loadImage('images/system4/blocks2.1.png', (x) => {
			this.waterImage = x;
		});

		loadImage('images/system4/blocks1.1.png', (x) => {
			this.block1Image = x;
		});

		loadImage('images/system4/blocks2.png', (x) => {
			this.block2Image = x;
		});


		loadImage('images/system4/mask.png', (x) => {
			this.maskImage = x;
		});

	}



	drawBlocks() {

		push();
		scale(0.9);
		translate(0,20,0);

		textSize(15);

		var x = width/2 - this.block1Image.width/2;
		var y = height/2 - this.block1Image.height/2;

		stroke('#64fdff');
		fill('#64fdff');

		var a = this.waterLevel*50;

		rect(x+90 - (this.reservoirArea-0.5)*13.5, y+295-a, 122 + (this.reservoirArea-0.5)*13.5, a);

		image(this.block2Image, x+70 - (this.reservoirArea/5)*70, y);
		image(this.block1Image, x, y);

		tint(255, 255*this.inputFlow);
		image(this.waterImage, x, y);

		drawAperture(x+250,y+255, 40, sqrt(this.exitArea), 'cyan');

		drawAperture(x+20,y+30, 40, sqrt(this.inputFlow), 'blue');

		drawArrow(createVector(x+290, y+285), createVector(50,0), 'green', 8*this.outputFlow);

		drawArrow(createVector(x+20- (this.reservoirArea-0.5)*13.5,y+295-a), createVector(50,0), 'red', 3);

		drawArrow(createVector(x+320, y+30), createVector(0,50), 'black', this.gravity/2);

		noStroke();

		fill('red');
		text(this.waterLevel.toFixed(2), x+20 - (this.reservoirArea-0.5)*13.5,y+290-a);

		fill('green');
		text(this.outputFlow.toFixed(2), x+370, y+280);

		fill('blue');
		text(this.inputFlow.toFixed(2), x-40,y+30);

		fill('cyan');
		text(this.exitArea.toFixed(2), x+250,y+225);

		fill('black');
		text(this.gravity.toFixed(2), x+340, y+40);

		pop();
	}



	getImagesFromLevel(level) {

		let localImage;

		let _level = this.waterLevel*this.NUM_LEVEL_IMG/4;
		if (_level >= this.NUM_LEVEL_IMG) _level = this.NUM_LEVEL_IMG-1;

		_level = this.NUM_LEVEL_IMG - Math.floor(_level) - 1;


		if (this.levelImages[_level] != 0) {
//			console.log('exists level')
			localImage = this.levelImages[_level];

			this.currentLevelImage = this.levelImages[_level];
		} else {

			loadImage('images/system4/imgs2/level_'+(_level+1)+'.jpg', (x) => {
				this.levelImages[_level] = x;
			});

//			console.log('does not exists level')
			localImage = this.currentLevelImage;

		}

		return localImage;
	}



	drawFlowImage(levelImage, flowImage) {

		var anImage = createImage(levelImage.width, levelImage.height);

		anImage.copy(levelImage, 0, 0, levelImage.width, levelImage.height, 0, 0, levelImage.width, levelImage.height);

//		console.log(levelImage, anImage);

		anImage.loadPixels();
		this.maskImage.loadPixels();
		flowImage.loadPixels();


		let x, y;
		for (y = 0; y < anImage.height; y++) {
			for (x = 0; x < anImage.width; x++) {

				let index = (x + y * anImage.width) * 4;

					let normalMask = this.maskImage.pixels[index]/255;

					anImage.pixels[index + 0] =  anImage.pixels[index + 0]*(1-normalMask) + ((3*anImage.pixels[index + 0]+flowImage.pixels[index + 0])/4)*normalMask;
					anImage.pixels[index + 1] =  anImage.pixels[index + 1]*(1-normalMask) + ((3*anImage.pixels[index + 1]+flowImage.pixels[index + 1])/4)*normalMask;
					anImage.pixels[index + 2] =  anImage.pixels[index + 2]*(1-normalMask) + ((3*anImage.pixels[index + 2]+flowImage.pixels[index + 2])/4)*normalMask;

			}
		}

		anImage.updatePixels();

		image(anImage,width/2-150,5,500,500);
	}



	getImagesFromFlow(flow) {

		let localImage;

		let _flow = this.inputFlow*this.NUM_FLOW_IMG;
		if (_flow >= this.NUM_FLOW_IMG) _flow = this.NUM_FLOW_IMG-1;

		_flow = Math.floor(_flow);

		let _whichFlow = Math.floor(Math.random()*(this.NUM_FLOW_IMG_PER_FLOW-1));


		if (this.flowImages[_flow][_whichFlow] != 0) {
//			console.log('exists flow')

			localImage =this.flowImages[_flow][_whichFlow];

			this.currentFlowImage = this.flowImages[_flow][_whichFlow];
		} else {

			loadImage('images/system4/imgs2/flow_'+(_flow+1)+'_'+(_whichFlow+1)+'.jpg', (x) => {
				this.flowImages[_flow][_whichFlow] = x;
			});

//			console.log('does not exists flow')
			localImage = this.currentFlowImage;
		}


		return localImage;
	}



	drawImages() {

		let levelImage = this.getImagesFromLevel(this.waterLevel);
		let flowImage = this.getImagesFromFlow(this.inputFlow);


		if ( (levelImage != 0) && (flowImage != 0) )
			this.drawFlowImage(levelImage, flowImage);
	}




	draw() {


		if (this.block1Image && this.block2Image && this.maskImage) {

			if (this.drawingBlocks) this.drawBlocks();

			if (this.drawingImages) this.drawImages();

		}


	}



}