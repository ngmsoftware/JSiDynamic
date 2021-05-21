


// function resetButtonClicked() {
  
//   _t = 0;

//   _cartPosition = 0.0;
//   _block1Position = 0;
//   _block2Position = 0;

//   osciloscope.reset();

// }






function init() {

  _inputScale = width/2;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#sliderBlock1Mass').slider('value',_block1Mass);
  $('#sliderBlock2Mass').slider('value',_block2Mass);
  $('#sliderCartBlock1Friction').slider('value',_cartBlock1Friction);
  $('#sliderBlock1Block2Friction').slider('value',_block1Block2Friction);
  $('#sliderCartBlock1SpringConstant').slider('value',_cartBlock1SpringConstant);
  $('#sliderBlock1Block2SpringConstant').slider('value',_block1Block2SpringConstant);

  $('#spanBlock1Mass').html(_block1Mass);
  $('#spanBlock2Mass').html(_block2Mass);
  $('#spanCartBlock1Friction').html(_cartBlock1Friction);
  $('#spanBlock1Block2Friction').html(_block1Block2Friction);
  $('#spanCartBlock1SpringConstant').html(_cartBlock1SpringConstant);
  $('#spanBlock1Block2SpringConstant').html(_block1Block2SpringConstant);


  system = new MechanicalPlanar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T,['blue'],['red', 'green']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_block2PositionRef , _block1PositionRef];

  $('#textReference').val(_globalReferences[0]);
}



  function updateValues() {

    _cartPosition = system.cartPosition;
    _block1Position = system.block1Position;
    _block2Position = system.block2Position;

    _globalOutputs = [_block2Position, _block1Position];
  }


  function updateSystem() {
      system.block1Mass = _block1Mass;
      system.block2Mass = _block2Mass;
      system.cartBlock1Friction = _cartBlock1Friction;
      system.block1Block2Friction = _block1Block2Friction;
      system.cartBlock1SpringConstant = _cartBlock1SpringConstant;
      system.block1Block2SpringConstant = _block1Block2SpringConstant;

  }





function draw() {

  _cartPosition = _globalInput;

  clear();

  updateSystem();

  system.draw(_cameraTeta, _cameraPhi, _cameraDist);

  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_cartPosition, _block1Position, _block2Position, _block1Mass, _block2Mass, _cartBlock1SpringConstant, _block1Block2SpringConstant, _cartBlock1Friction, _block1Block2Friction);

  osciloscope.update(_t, [_cartPosition], [_block1Position, _block2Position], _globalReferences); 

  updateValues();


}











