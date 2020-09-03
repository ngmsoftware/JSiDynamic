

class Osciloscope {

	constructor(divName, maxT, inputColors, outputColors) {

		this.maxT = maxT;
		this.divName = divName;
		

		this.layout = {
			margin: {
				l: 35,
				r: 5,
				b: 40,
				t: 5,
			},
            paper_bgcolor:'rgba(0,0,0,0)',
            plot_bgcolor:'rgba(0,0,0,0)',
			xaxis: {
				title: { text: 'time' },
				range: [0, this.maxT],
				tickcolor: '#000000',
				linecolor: '#000000',
				gridcolor: '#d0d0d0',
			},
			yaxis: {
				title: { text: 'amplitude' },
				range: [-0.05, 6.1],
				autorange: true,
				tickcolor: '#000000',
				linecolor: '#000000',
				gridcolor: '#d0d0d0',
			},
			showlegend: false,
		};



		this.tracesInput = [];
		this.tracesOutput = [];
		this.tracesReferences = [];


		for (var i = 0; i < inputColors.length; i++) {
			var c = inputColors[i];

			this.tracesInput.push({
			  x: [],
			  y: [],
			  mode: 'lines',
			  line: {color: c},
			});

		}


		for (var i = 0; i < outputColors.length; i++) {
			var c = outputColors[i];

			this.tracesOutput.push({
			  x: [],
			  y: [],
			  mode: 'lines',
			  line: {color: c, dash: 'solid'},
			});
		}



		for (var i = 0; i < outputColors.length; i++) {
			var c = outputColors[i];

			this.tracesReferences.push({
			  x: [],
			  y: [],
			  mode: 'lines',
			  line: {color: c, dash: 'dash'},
			});
		}



		Plotly.newPlot(this.divName, this.tracesInput.concat(this.tracesOutput.concat(this.tracesReferences)), this.layout,  {displayModeBar: false, staticPlot:true});

	}


	update(t, input, output, refences) {

		let len = this.tracesInput[0].x.length;

		if (t<this.maxT) {

			for (var i = 0; i < this.tracesInput.length; i++) {
				this.tracesInput[i].x.push(t);
				this.tracesInput[i].y.push(input[i]);
			}


			for (var i = 0; i < this.tracesOutput.length; i++) {
				this.tracesOutput[i].x.push(t);
				this.tracesOutput[i].y.push(output[i]);
			}


			for (var i = 0; i < this.tracesReferences.length; i++) {
				this.tracesReferences[i].x.push(t);
				this.tracesReferences[i].y.push(refences[i]);
			}

		} else {

			for (var i = 0; i < this.tracesInput.length; i++) {
				rollArray(this.tracesInput[i].x);
				rollArray(this.tracesInput[i].y);
				this.tracesInput[i].x[len-1] = t;
				this.tracesInput[i].y[len-1] = input[i];
			}


			for (var i = 0; i < this.tracesOutput.length; i++) {
				rollArray(this.tracesOutput[i].x);
				rollArray(this.tracesOutput[i].y);
				this.tracesOutput[i].x[len-1] = t;
				this.tracesOutput[i].y[len-1] = output[i];
			}


			for (var i = 0; i < this.tracesReferences.length; i++) {
				rollArray(this.tracesReferences[i].x);
				rollArray(this.tracesReferences[i].y);
				this.tracesReferences[i].x[len-1] = t;
				this.tracesReferences[i].y[len-1] = refences[i];
			}
		}





		if (t>this.maxT) {
			this.layout.xaxis.range[0] = t-this.maxT;
			this.layout.xaxis.range[1] = t;
		}

//		Plotly.plot('osciloscopeDiv', this.traces.concat(this.tracesBars), this.layout,  {displayModeBar: false, staticPlot:true});
		Plotly.redraw('osciloscopeDiv');

	}


	reset() {

		for (var i = 0; i < this.tracesInput.length; i++) {
			this.tracesInput[i].x = [];
			this.tracesInput[i].y = [];
		}

		for (var i = 0; i < this.tracesOutput.length; i++) {
			this.tracesOutput[i].x = [];
			this.tracesOutput[i].y = [];
		}

		this.layout.xaxis.range[0] = 0.0;
		this.layout.xaxis.range[1] = this.maxT;
	}

}


