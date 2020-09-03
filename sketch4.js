

// function resetButtonClicked() {
  
//   _t = 0;

//   _inputFlow = 0;
//   _outputFlow = 0;
//   _waterLevel = 0;

//   osciloscope.reset();

// }



function displayRadioChanged() {
 

  switch ($("input[name='displayRadio']:checked").val()) {
    case "images":
      system.drawingImages = true;
      system.drawingBlocks = false;
    break
    case "blocks":
      system.drawingImages = false;
      system.drawingBlocks = true;
    break
  }
  
}




function init() {
  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#slideRreservoirArea').slider('value',_reservoirArea);
  $('#sliderExitArea').slider('value',_exitArea);
  $('#sliderGravity').slider('value',_gravity);

  $('#spanReservoirArea').html(_reservoirArea);
  $('#spanExitArea').html(_exitArea);
  $('#spanGravity').html(_gravity);


  system = new MechanicalPlanar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T,['blue'],['red','green']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);
  
  _globalReferences = [_waterLevelRef];

  $('#textReference').val(_globalReferences[0]);
}



function updateValues() {

    _inputFlow = system.inputFlow;
    _waterLevel = system.waterLevel;
    _outputFlow = system.outputFlow;
  
    _globalOutputs = [_waterLevel];
}

function updateSystem() {

    system.reservoirArea = _reservoirArea;
    system.exitArea = _exitArea;
    system.gravity = _gravity;


}




function setup() {
  var myCanvas = createCanvas(SCREEN_SIZE_W, SCREEN_SIZE_H/3);
  myCanvas.parent("systemCanvas");  

  $('#osciloscopeDiv').height(SCREEN_SIZE_H/4);

  frameRate(60);

  init();
}




function draw() {

  _inputFlow = _globalInput;
  if (_inputFlow < 0) {
    _inputFlow = 0;
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

  system.update(_inputFlow, _waterLevel, _reservoirArea, _exitArea, _gravity);

  osciloscope.update(_t, [_inputFlow], [_waterLevel, _outputFlow], _globalReferences);

  updateValues();



}











