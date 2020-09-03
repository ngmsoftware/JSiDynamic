

// function resetButtonClicked() {
  
//   _t = 0;

//   _inputVoltage = 0;
//   _outputTemperature = 0;

//   osciloscope.reset();


// }






function init() {

  _inputScale = 200;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#sliderThermalResistance').slider('value',_thermalResistance);
  $('#sliderThermalCapacity').slider('value',_thermalCapacity);
  $('#sliderVoltageDegree').slider('value',_voltageDegree);

  $('#spanThermalResistance').html(_thermalResistance);
  $('#spanThermalCapacity').html(_thermalCapacity);
  $('#spanVoltageDegree').html(_voltageDegree);


  system = new MechanicalPlanar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T,['blue'],['red']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_outputTemperatureRef];

  $('#textReference').val(_globalReferences[0]);
}


function updateValues() {

    _inputVoltage = system.inputVoltage;
    _outputTemperature = system.outputTemperature;
  
    _globalOutputs = [_outputTemperature];
}

function updateSystem() {

    system.thermalCapacity = _thermalCapacity;
    system.thermalResistance = _thermalResistance;

}





function setup() {
  var myCanvas = createCanvas(SCREEN_SIZE_W, SCREEN_SIZE_H/3);
  myCanvas.parent("systemCanvas");  

  $('#osciloscopeDiv').height(SCREEN_SIZE_H/4);

  frameRate(60);

  init();
}





function draw() {

  _inputVoltage = _globalInput;
  if (_inputVoltage < 0) {
    _inputVoltage = 0;
    _globalInput = 0;
  }

  clear();

  updateSystem();

  system.draw();

  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_inputVoltage, _outputTemperature, _thermalResistance, _thermalCapacity, _voltageDegree);

  osciloscope.update(_t, [_inputVoltage], [_outputTemperature], _globalReferences);

  updateValues();

}











