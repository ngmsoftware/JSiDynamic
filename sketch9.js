





function init() {

  _inputScale = width;

  _cameraDist = 1700;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#sliderBar1SpringConstant').slider('value',_bar1SpringConstant);
  $('#sliderBar1Friction').slider('value',_bar1Friction);
  $('#sliderBar1Inertia').slider('value',_bar1Inertia);
  $('#sliderBar2SpringConstant').slider('value',_bar2SpringConstant);
  $('#sliderBar2Friction').slider('value',_bar2Friction);
  $('#sliderBar2Inertia').slider('value',_bar2Inertia);


  $('#spanBar1SpringConstant').html(_bar1SpringConstant);
  $('#spanBar1Friction').html(_bar1Friction);
  $('#spanBar1Inertia').html(_bar1Inertia);
  $('#spanBar2SpringConstant').html(_bar2SpringConstant);
  $('#spanBar2Friction').html(_bar2Friction);
  $('#spanBar2Inertia').html(_bar2Inertia);


  system = new DoubleBar('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T, ['blue'],['red', 'green']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_bar1TorqueRef];

  $('#textReference').val(_globalReferences[0]);

}


function updateValues() {

    _bar1Angle = system.bar1Angle;
    _bar2Angle = system.bar2Angle;
    _bar1Velocity = system.bar1Velocity;
    _bar2Velocity = system.bar2Velocity;

    _globalOutputs = [_bar1Angle, _bar1Angle];
}

function updateSystem() {

    system.bar1Angle = _bar1Angle;
    system.bar2Angle = _bar2Angle;
    system.bar1Velocity = _bar1Velocity;
    system.bar2Velocity = _bar2Velocity;

    system.bar1SpringConstant = _bar1SpringConstant;
    system.bar1Friction = _bar1Friction;
    system.bar1Inertia = _bar1Inertia;
    system.bar2SpringConstant = _bar2SpringConstant;
    system.bar2Friction = _bar2Friction;
    system.bar2Inertia = _bar2Inertia;


}




function draw() {


  _bar1TorqueInput = _globalInput/25.0;

  clear();

  updateSystem();

  system.draw(_cameraTeta, _cameraPhi, _cameraDist);

  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_bar1TorqueInput, _bar1Angle, _bar2Angle, _bar1Velocity, _bar2Velocity, _bar1SpringConstant, _bar1Friction, _bar1Inertia, _bar2SpringConstant, _bar2Friction, _bar2Inertia);

  osciloscope.update(_t, [_bar1TorqueInput], [_bar1Angle, _bar2Angle], _globalReferences);

  updateValues();
  
}











