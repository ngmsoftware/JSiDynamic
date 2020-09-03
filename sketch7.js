


// function resetButtonClicked() {
  
//   _t = 0;


//   system.trace[0].x = [];
//   system.trace[0].y = [];

//   osciloscope.reset();

// }






function init() {
  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#sliderPrayReproductionFactor').slider('value',_prayReproductionFactor);
  $('#sliderPredatorDecayingFactor').slider('value',_predatorDecayingFactor);
  $('#sliderPrayExpositionFactor').slider('value',_prayExpositionFactor);
  $('#sliderPredatorAbilityFactor').slider('value',_predatorAbilityFactor);

  $('#spanPrayReproductionFactor').html(_prayReproductionFactor);
  $('#spanPredatorDecayingFactor').html(_predatorDecayingFactor);
  $('#spanPrayExpositionFactor').html(_prayExpositionFactor);
  $('#spanPredatorAbilityFactor').html(_predatorAbilityFactor);


  system = new MechanicalPlanar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T,['blue'],['red', 'green']);

  system.load();

  system.predatorNumber = _predatorNumber;

  updateValues();

    CANVAS.show();
    $('#ssPlotCanvas').hide();


  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_prayNumberRef, _predatorNumberRef];

  $('#textReference').val(_globalReferences[0]);
}



  function updateValues() {
    _inputPrayRate = system.inputPrayRate;
    _prayNumber = system.prayNumber;
    _predatorNumber = system.predatorNumber;

    _globalOutputs = [_prayNumber, _predatorNumber];
  }


  function updateSystem() {
      system.PrayReproductionFactor = _prayReproductionFactor;
      system.PredatorDecayingFactor = _predatorDecayingFactor;
      system.PrayExpositionFactor = _prayExpositionFactor;
      system.PredatorAbilityFactor = _predatorAbilityFactor;
  }




function displayRadioChanged() {
 

  switch ($("input[name='displayRadio']:checked").val()) {
    case "images":
      CANVAS.show();
      $('#ssPlotCanvas').hide();
      system.drawingImages = true;
      system.drawingBlocks = false;
    break
    case "blocks":
      CANVAS.hide();
      $('#ssPlotCanvas').show();
      system.drawingImages = false;
      system.drawingBlocks = true;
    break
  }
  
}




function setup() {
  CANVAS = createCanvas(SCREEN_SIZE_W, SCREEN_SIZE_H/3);
  CANVAS.parent("systemCanvas");  

  $('#osciloscopeDiv').height(SCREEN_SIZE_H/4);

  frameRate(60);

  init();
}





function draw() {

  _inputPrayRate = _globalInput;
  if (_inputPrayRate<0) {
    _inputPrayRate = 0;
    _globalInput = 0;
  }

  clear();

  updateSystem();

  system.draw();


  // TODO: when showing state space, we use another div that DOES NOT HAVE the 2d canvas. Because of that, cursor does not work... deal with it... 
  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_inputPrayRate, _prayNumber, _predatorNumber, _prayReproductionFactor, _predatorDecayingFactor, _prayExpositionFactor, _predatorAbilityFactor);

  osciloscope.update(_t, [_inputPrayRate], [_prayNumber, _predatorNumber], _globalReferences); 

  updateValues();

  _inputPrayRate = 0.0;
}











