
class MechanicalPlanar {


	constructor(canvas, dt) {


		this.canvas = canvas;

		this.dt = dt;

		this.inputVoltage = 0;
		this.outputTemperature = 0;

		this.thermalResistance = 1;
		this.thermalCapacity = 1;

		this.p0x = 0;
		this.p0y = 0;

		this.drawingImages = false;
		this.drawingBlocks = true;
	}


	update( inputVoltage, outputTemperature, thermalResistance, thermalCapacity, voltageDegree) {
		this.inputVoltage = inputVoltage;
		this.outputTemperature = outputTemperature;

		this.thermalResistance = thermalResistance;
		this.thermalCapacity = thermalCapacity;
		this.voltageDegree = voltageDegree;

		// dynamic
		var dT0 = (this.inputVoltage/this.voltageDegree - this.outputTemperature)/(this.thermalCapacity*this.thermalResistance);
		this.outputTemperature += dT0*this.dt;

	}


	load() {
		loadImage('images/system3/heater_cold.png', (x) => {
			this.heaterColdImage = x;
		});
		loadImage('images/system3/heater_hot.png', (x) => {
			this.heaterHotImage = x;
		});
		loadImage('images/system3/voltimeter.png', (x) => {
			this.voltimeterImage = x;
		});
		loadImage('images/system3/voltimeter_2.png', (x) => {
			this.voltimeter2Image = x;
		});
		loadImage('images/system3/resistance.png', (x) => {
			this.resistanceImage = x;
		});
	}



	drawBlocks() {

		fill(255);
		stroke('red');
		var x = 110 + width/2 - this.heaterColdImage.width/2;
		var y = height/2 - this.heaterColdImage.height/2;


		var blockWidth = (1+this.thermalCapacity*this.thermalResistance/10)*this.heaterColdImage.width/4;

		fill(255,0,0, this.outputTemperature);
		rect( x, y, blockWidth, this.heaterColdImage.height);
		image(this.resistanceImage, x-110, y+this.resistanceImage.height/2);

		arrowText(this.outputTemperature.toFixed(2), x+blockWidth+30, y+50, x+blockWidth - 50, y+100, 'red',2, 18);
		arrowText(this.inputVoltage.toFixed(2), x-190, y+30, x-120, y+100, 'blue',2, 18);
	}



	drawImages() {

		push();
//			var s = 0.5+this.thermalCapacity/5;
		var s = 1;
		scale(s);
		tint(255, 255);
		image(this.heaterColdImage, (width/2 - this.heaterColdImage.width/2)/s, (height/2 - this.heaterColdImage.height/2)/s);
		tint(255, this.outputTemperature);
		image(this.heaterHotImage, (width/2 - this.heaterHotImage.width/2)/s, (height/2 - this.heaterHotImage.height/2)/s);
		pop();


		push();
		scale(1);
		image(this.voltimeterImage,width/2 - this.heaterColdImage.width/2 - this.voltimeterImage.width, height/2 - this.voltimeterImage.height/2);
		var midVx = width/2 - this.heaterColdImage.width/2 - this.voltimeterImage.width/2;
		var midVy = height/2 +50;
		var ang = PI/2 + (PI/2)*(127.5-this.inputVoltage)/255;
		stroke(0);
		strokeWeight(4);
		line(midVx, midVy, midVx + 100*cos(ang), midVy - 100*sin(ang));

		image(this.voltimeter2Image,width/2 - this.heaterColdImage.width/2 - this.voltimeter2Image.width, height/2 - this.voltimeter2Image.height/2);
		pop();

	}




	draw() {

		if (this.heaterColdImage && this.heaterHotImage && this.voltimeter2Image && this.voltimeterImage && this.resistanceImage) {

			if (this.drawingBlocks) this.drawBlocks();

			if (this.drawingImages) this.drawImages();
		}
	}



}