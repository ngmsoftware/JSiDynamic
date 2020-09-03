

// external varaibles
//
// _globalInput;
// _globalOutputs;
// _globalReferences;


class Communication {

	constructor(onCloseFnc, outSignal = 1) {

		this.outSignal = outSignal

		this.socket = new WebSocket("ws://localhost:6660");

		this.socket.parent = this;

		this.socket.onopen = function(event) {
		  console.log("[open] Connection established");
		};

		this.socket.onmessage = function(event) {
			console.log(`received:  ${event.data}`);


			let cmdPar = event.data.split("|");

			let cmd = cmdPar[0];
			let par = cmdPar[1];


			let comm = event.target.parent;

			var N;
			var outStr;

			switch (cmd) {

				case 'set input':
					_globalInput = parseFloat(par);
				break;

				case 'get outputs':
					N = _globalOutputs.length;

					let sigOut = comm.outSignal;

					outStr = N + ',' + _globalOutputs.map((x)=>sigOut*x).join(',');

					console.log(outStr);

					comm.socket.send(outStr);
				break;

				case 'get references':
					N = _globalReferences.length;

					outStr = N + ',' + _globalReferences.join(',');

					console.log(outStr);

					comm.socket.send(outStr);
				break;
			}


		};

		this.socket.onclose = function(event) {
			if (event.wasClean) {
				console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				console.log('[close] Connection died');
				onCloseFnc()
			}

		};

		this.socket.onerror = function(error) {
			console.log(`[error] ${error.message}`);

			onCloseFnc();
		};



	}
	






}