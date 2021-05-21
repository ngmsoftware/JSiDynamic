

// function resetButtonClicked() {
  
//   _t = 0;

//   _angInput = 0;
//   _angBlock1 = 0;
//   _angBlock2 = 0;
//   _angBlock3 = 0;
//   _velBlock1 = 0;
//   _velBlock2 = 0;
//   _velBlock3 = 0;


//   osciloscope.reset();

// }





function init() {

  _inputScale = width;

  _cameraDist = 1700;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);

  $('#sliderBlock1Inertia').slider('value',_block1Inertia);
  $('#sliderBlock2Inertia').slider('value',_block2Inertia);
  $('#sliderBlock3Inertia').slider('value',_block3Inertia);
  $('#sliderBlock1Friction').slider('value',_block1Friction);
  $('#sliderBlock2Friction').slider('value',_block2Friction);
  $('#sliderSpring1Constant').slider('value',_spring1Constant);
  $('#sliderSpring2Constant').slider('value',_spring2Constant);


  $('#spanBlock1Inertia').html(_block1Inertia);
  $('#spanBlock2Inertia').html(_block2Inertia);
  $('#spanBlock3Inertia').html(_block3Inertia);
  $('#spanBlock1Friction').html(_block1Friction);
  $('#spanBlock2Friction').html(_block2Friction);
  $('#spanSpring1Constant').html(_spring1Constant);
  $('#spanSpring2Constant').html(_spring2Constant);


  system = new MechanicalRotatory('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T, ['blue'],['yellow', 'green','red']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_angBlock3Ref, _angBlock2Ref, _angBlock1Ref];

  $('#textReference').val(_globalReferences[0]);
}


function updateValues() {

    _angBlock1 = system.angBlock1;
    _angBlock2 = system.angBlock2;
    _angBlock3 = system.angBlock3;
    _velBlock1 = system.velBlock1;
    _velBlock2 = system.velBlock2;
    _velBlock3 = system.velBlock3;

    _globalOutputs = [_angBlock3, _angBlock2, _angBlock1];
}

function updateSystem() {

    system.angBlock1 = _angBlock1;
    system.angBlock2 = _angBlock2;
    system.angBlock3 = _angBlock3;
    system.block1Inertia = _block1Inertia;
    system.block2Inertia = _block2Inertia;
    system.block3Inertia = _block3Inertia;
    system.block1Friction = _block1Friction;
    system.block2Friction = _block2Friction;
    system.spring1Constant = _spring1Constant;
    system.spring2Constant = _spring2Constant;


}




function draw() {


  _angInput = _globalInput;

  clear();

  updateSystem();

  system.draw(_cameraTeta, _cameraPhi, _cameraDist);

  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_angInput, _angBlock1, _angBlock2, _angBlock3, _velInput, _velBlock1, _velBlock2, _velBlock3, _block1Inertia, _block2Inertia, _block3Inertia,  _spring1Constant, _spring2Constant, _block1Friction, _block2Friction);

  osciloscope.update(_t, [_angInput], [_angBlock1, _angBlock2, _angBlock3], _globalReferences);

  updateValues();
  
}











