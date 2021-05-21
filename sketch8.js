





function init() {

  _inputScale = width;

  _cameraDist = 1700;

  $('#systemCanvas').width(SCREEN_SIZE_W);
  $('#mainTable').width(SCREEN_SIZE_W);


  $('#sliderInertia').slider('value',_inertia);
  $('#sliderFriction').slider('value',_friction);
  $('#sliderResistance').slider('value',_resistance);
  $('#sliderInductance').slider('value',_inductance);
  $('#sliderKv').slider('value',_Kv);
  $('#sliderKt').slider('value',_Kt);


  $('#spanInertia').html(_inertia);
  $('#spanFriction').html(_friction);
  $('#spanResistance').html(_resistance);
  $('#spanInductance').html(_inductance);
  $('#spanKv').html(_Kv);
  $('#spanKt').html(_Kt);


  system = new DCMotor('systemCanvas', DT);
  osciloscope = new Osciloscope('osciloscopeDiv', MAX_T, ['blue'],['magenta', 'green','red']);

  system.load();

  updateValues();

  setTimeout(()=>{system.draw();}, 500);

  _globalReferences = [_angRef];

  $('#textReference').val(_globalReferences[0]);

}


function updateValues() {

    _ang = system.ang;
    _vel = system.vel;
    _acc = system.acc;

    _globalOutputs = [_ang, _vel];
}

function updateSystem() {

    system.ang = _ang;
    system.vel = _vel;
    system.acc = _acc;

    system.inertia = _inertia;
    system.friction = _friction;
    system.resistance = _resistance;
    system.inductance = _inductance;
    system.Kv = _Kv;
    system.Kt = _Kt;
    system.P = _P;


}




function draw() {


  _angInput = _globalInput/20.0;

  clear();

  updateSystem();

  system.draw(_cameraTeta, _cameraPhi, _cameraDist);

  drawCursor();

  if (_paused) 
    return;

  _t += DT;

  processInput();

  system.update(_angInput, _ang, _vel, _acc, _inertia, _friction, _resistance, _inductance, _Kv, _Kt, _P);

  osciloscope.update(_t, [_angInput], [_ang, 0.04*_vel, 0.004*_acc], _globalReferences);

  updateValues();
  
}











