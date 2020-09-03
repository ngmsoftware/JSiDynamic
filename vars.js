$ = jQuery;


var SCREEN_SIZE_W = 1200;
var SCREEN_SIZE_H = 900;
var DT = 0.05;
var MAX_T = 60;
var CANVAS;
var CURSOR_SIZE = 20;
var CLICK_SHOW_TIME = 10;
var T0 = 10;


var _t = 0.0;
var _paused = true; 

var _globalInput = 0.0;
var _globalOutputs = [];
var _globalReferences = [];
var _inputAmplitude = 1.0;
var _inputFrequency = 1.0;
var _inputScale = 1.0;


var _cameraTeta = 0;
var _cameraPhi = 0;
var _cameraDist = 800;

var _simulationPaused = false;
var _input = "none";
var _isDragging = false;
var _hasMousePressed = false;

var _isControlling = false;
var _communicator;

// Mechanical planar 1

var _blockMass = 0.6;
var _springConstant = 0.4;
var _blockFriction = 0.55;

var _blockPos = 0;
var _cartPos = 0;

var _blockVel = 0;
var _cartVel = 0;

var _blockRef = 10;

// Mechanical rotatory
var _angInput = 0.0;

var _angInput = 0.0;
var _angBlock1 = 0.0;
var _angBlock2 = 0.0;
var _angBlock3 = 0.0;
var _velInput = 0.0;
var _velBlock1 = 0.0;
var _velBlock2 = 0.0;
var _velBlock3 = 0.0;


var _block1Inertia = 0.55;
var _block2Inertia = 0.45;
var _block3Inertia = 2.6;

var _block1Friction = 0.51;
var _block2Friction = 0.52;

var _spring1Constant = 0.4;
var _spring2Constant = 0.45;

var _angBlock1Ref = Math.PI/4;
var _angBlock2Ref = Math.PI/4;
var _angBlock3Ref = Math.PI/4;

// thermal

var _thermalResistance = 0.9;
var _thermalCapacity = 1.1;
var _inputVoltage = 0;
var _outputTemperature = 0;
var _voltageDegree = 3.5;

var _outputTemperatureRef = 100;

// liquid level

var _gravity = 9.8;
var _exitArea = 0.05;
var _reservoirArea = 1.0;

var _inputFlow = 0.0;
var _outputFlow = 0.0;
var _waterLevel = 0.0;

var _waterLevelRef = 3;

// pendulum

var _inputForce = 0;
var _cartPosition = 0;
var _ballAngle = 0.0;

var _cartMass = 0.1;
var _ballMass = 0.1;
var _cartFriction = 0.5;
var _length = 0.5;
var _gravity = 9.8;

var _ballAngleRef = 0;

// double spring mass

var _cartPosition = 0.0;
var _block1Position = 0;
var _block2Position = 0;

var _block1Mass = 0.5;
var _block2Mass = 0.5;
var _cartBlock1Friction = 0.1;
var _block1Block2Friction = 0.1;
var _cartBlock1SpringConstant = 0.5;
var _block1Block2SpringConstant = 0.5;

var _block1PositionRef = 10;
var _block2PositionRef = 10;


// perdator - pray


_inputPrayRate = 0.0;
_predatorNumber = 1;
_prayNumber = 1;

_prayReproductionFactor = 0.51;
_predatorDecayingFactor = 0.48;
_prayExpositionFactor = 0.49;
_predatorAbilityFactor = 0.505;

_predatorNumberRef = 10;
_prayNumberRef = 10;


