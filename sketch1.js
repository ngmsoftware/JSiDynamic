

// function resetButtonClicked() {
  
//   _t = 0;

//   _cartPos = 0;
//   _cartVel = 0;
//   _blockPos = 0;
//   _blockVel = 0;

//   osciloscope.reset();

// }



function init() {
  _inputScale = width/4;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#sliderBlockMass').slider('value',_blockMass);
  $('#sliderBlockFriction').slider('value',_blockFriction);
  $('#sliderSpringConstant').slider('value',_springConstant);

  $('#spanBlockMass').html(_blockMass);
  $('#spanBlockFriction').html(_blockFriction);
  $('#spanSpringConstant').html(_springConstant);

  system = new MechanicalPlanar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T,['blue'],['red']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_blockRef];

  $('#textReference').val(_globalReferences[0]);
}



function updateValues() {

    _cartVel = system.velCart;
    _blockVel = system.velBlock;
    _cartPos = system.posCart;
    _blockPos = system.posBlock;


    _globalOutputs = [_blockPos];
}

  function updateSystem() {
    system.blockMass = _blockMass;
    system.springConstant = _springConstant;
    system.blockFriction = _blockFriction;
}






function draw() {

  _cartPos = _globalInput;

  clear();

  updateSystem();

  system.draw(_cameraTeta, _cameraPhi, _cameraDist);

  drawCursor();

  if (_paused) 
    return;

  _t += DT;


  processInput();

  system.update(_cartPos, _blockPos, _cartVel, _blockVel, _blockMass, _springConstant, _blockFriction);

  osciloscope.update(_t, [_cartPos], [_blockPos], _globalReferences); 

  updateValues();


}











