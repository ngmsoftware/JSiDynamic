
class MechanicalPlanar {


	constructor(canvas, dt) {


		this.canvas = canvas;

		this.dt = dt;

		this.RK_STEPS = 10;

		this.inputPrayRate = 0;
		this.prayNumber = 0;
		this.predatorNumber = 0;

		this.prayReprodutionFactor = 1;
		this.predatorDecayingFactor = 1;
		this.prayExpositionFactor = 1;
		this.predatorAbilityFactor = 1;


		this.prayList = [];
		this.predatorList = [];

		this.drawingImages = true;
		this.drawingBlocks = false;

		this.initSSplot();

	}


	dynamicStep(inputPrayRate, prayNumber, predatorNumber, prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor) {

		let xp = prayReprodutionFactor*prayNumber - prayExpositionFactor*prayNumber*predatorNumber + inputPrayRate;
		let yp = -predatorDecayingFactor*predatorNumber + predatorAbilityFactor*prayNumber*predatorNumber;

		return [xp, yp]
	}


	rkStep(inputPrayRate, prayNumber, predatorNumber, prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor, dt) {

		let k1 = this.dynamicStep(inputPrayRate, prayNumber             , predatorNumber             , prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor);
		let k2 = this.dynamicStep(inputPrayRate, prayNumber + dt*k1[0]/2, predatorNumber + dt*k1[1]/2, prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor);
		let k3 = this.dynamicStep(inputPrayRate, prayNumber + dt*k2[0]/2, predatorNumber + dt*k2[1]/2, prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor);
		let k4 = this.dynamicStep(inputPrayRate, prayNumber +   dt*k3[0], predatorNumber +   dt*k3[1], prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor);

		this.prayNumber += dt*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0])/6;
		this.predatorNumber += dt*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1])/6;

	}


	update(inputPrayRate, prayNumber, predatorNumber, prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor) {

		this.inputPrayRate = inputPrayRate;
		this.prayNumber = prayNumber;
		this.predatorNumber = predatorNumber;

		this.prayReprodutionFactor = prayReprodutionFactor;
		this.predatorDecayingFactor = predatorDecayingFactor;
		this.prayExpositionFactor = prayExpositionFactor;
		this.predatorAbilityFactor = predatorAbilityFactor;

		for (var i = 0; i < this.RK_STEPS; i++) {
			this.rkStep(this.inputPrayRate, this.prayNumber, this.predatorNumber, prayReprodutionFactor, predatorDecayingFactor, prayExpositionFactor, predatorAbilityFactor, this.dt/this.RK_STEPS);
		}

	}


	initSSplot() {

		this.layout = {
			margin: {
				l: 45,
				r: 45,
				b: 45,
				t: 45,
			},
			paper_bgcolor:'rgba(0,0,0,0)',
			plot_bgcolor:'rgba(0,0,0,0)',
			xaxis: {
				title: 'predator' ,
				range: [-0.5, 10],
				autorange: true,
			},
			yaxis: {scaleanchor:"x", scaleratio:1 ,
				title: 'pray',
				range: [-0.5, 10],
				autorange: true,
			},
			showlegend: false,
		};


		this.trace = [{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: 'orange'},
		}];


		Plotly.newPlot('ssPlotCanvas', this.trace, this.layout,  {displayModeBar: false, staticPlot:true});

	}




	load() {

		loadImage('images/system7/predator.png', (x) => {
			this.predatorImage = x;
		});
		loadImage('images/system7/pray.png', (x) => {
			this.prayImage = x;
		});

	}



	drawBlocks() {

		this.trace[0].x.push(this.predatorNumber)
		this.trace[0].y.push(this.prayNumber)


		Plotly.redraw('ssPlotCanvas');
	}



	drawImages() {

		if (this.predatorImage && this.prayImage) {

			if ((this.prayNumber > 1000) || (this.predatorNumber>1000))
				return;

			image(this.predatorImage, 10, 60, 40, 40);
			image(this.prayImage, 10, 10, 40, 40);


			arrowText(this.prayNumber.toFixed(2), 120, 20, 60, 40, 'red', 2, 16);
			arrowText(this.predatorNumber.toFixed(2), 120, 70, 60, 90, 'green', 2, 16);



			for (var i = 0; i < this.prayList.length - 10*this.prayNumber; i++) {
				this.prayList.pop();
			}
			for (var i = 0; i < 10*this.prayNumber - this.prayList.length - 1; i++) {
				this.prayList.push([Math.random()*(width-120)+120, Math.random()*height]);
			}


			for (var i = 0; i < this.prayList.length; i++) {
				image(this.prayImage, this.prayList[i][0], this.prayList[i][1], 40, 40);
			}






			for (var i = 0; i < this.predatorList.length - 10*this.predatorNumber; i++) {
				this.predatorList.pop();
			}
			for (var i = 0; i < 10*this.predatorNumber - this.predatorList.length - 1; i++) {
				this.predatorList.push([Math.random()*(width-120)+120, Math.random()*height]);
			}


			for (var i = 0; i < this.predatorList.length; i++) {
				image(this.predatorImage, this.predatorList[i][0], this.predatorList[i][1], 40, 40);
			}




		}


	}





	draw() {

		if (this.drawingBlocks) this.drawBlocks();

		if (this.drawingImages) this.drawImages();

		
	}



}