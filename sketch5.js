


// function resetButtonClicked() {
  
//   _t = 0;

//   _inputForce = 0;
//   _cartPosition = 0;
//   _ballAngle = 0;

//   system.x1 = 0;
//   system.x2 = 0;
//   system.x3 = 0;
//   system.x4 = 0;

//   osciloscope.reset();

// }






function init() {

  _inputScale = 10;

  _cameraDist = 350;
  _cameraTeta = 0.54;
  _cameraPhi = 0.36;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#slideCartMass').slider('value',_cartMass);
  $('#sliderBallMass').slider('value',_ballMass);
  $('#sliderGravity').slider('value',_gravity);
  $('#sliderLength').slider('value',_length);
  $('#sliderCartFriction').slider('value',_cartFriction);

  $('#spanCartMass').html(_cartMass);
  $('#spanBallMass').html(_ballMass);
  $('#spanGravity').html(_gravity);
  $('#spanCartFriction').html(_cartFriction);
  $('#spanLength').html(_length);


  system = new MechanicalPlanar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T,['blue'],['green','red']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_ballAngleRef];

  $('#textReference').val(_globalReferences[0]);
}




function updateValues() {

    _inputForce = system.inputForce;
    _ballAngle = system.ballAngle;
    _cartPosition = system.cartPosition;

    _globalOutputs = [_ballAngle];
}

function updateSystem() {

    system.cartMass = _cartMass;
    system.cartFriction = _cartFriction;
    system.ballMass = _ballMass;
    system.length = _length;
    system.gravity = _gravity;
}




function draw() {

  _inputForce = _globalInput;

  if (!_isDragging && (_input=="none")) {
      _inputForce = 0;
      _globalInput = 0;
    }


  clear();

  updateSystem();

  system.draw(_cameraTeta, _cameraPhi, _cameraDist);

  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_inputForce, _cartPosition, _ballAngle, _cartMass, _ballMass, _cartFriction, _length, _gravity);

  osciloscope.update(_t, [_inputForce], [_cartPosition, _ballAngle], _globalReferences);

  updateValues();

}











