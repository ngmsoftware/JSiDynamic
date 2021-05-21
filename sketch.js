
function inputSelectChanged() {

  var option = $('#inputSelect').val();

  _input = option;
}



function playButtonClicked() {
  if (_paused) {
    $('#playButton').html('Pause');
    _paused = false;
  } else {
    $('#playButton').html('Play');
    _paused = true;
  }

}


function resetButtonClicked() {
  document.location.reload();
}


function textReferenceChanged() {
  _globalReferences[0] = parseFloat($('#textReference').val());
}


function activateControl() {
  _globalReferences[0] = parseFloat($('#textReference').val());
  _communicator = new Communication(()=>{
    resetComtrol();
    alert('Control Server is out...');
  });

  $('#buttonControl').html('stop...');

  _isControlling = true;

  _input = 'none';

  $('#inputSelect').prop('disabled', true);
  $('#inputSelect option[value=none]').prop('selected', true);  
}

function resetComtrol() {
  $('#buttonControl').html('Control');

  _isControlling = false;

  _communicator.socket.close();

  $('#inputSelect').prop('disabled', false);
}

function controlButtonClicked() {
  if (!_isControlling) {
    activateControl();
  } else {
    resetComtrol();
  }

}



function displayRadioChanged() {
 

  switch ($("input[name='displayRadio']:checked").val()) {
    case "images":
      system.drawingImages = true;
      system.drawingBlocks = false;
      system.drawingAxis = false;
    break
    case "blocks":
      system.drawingImages = false;
      system.drawingBlocks = true;
      system.drawingAxis = false;
    break
    case "axis":
      system.drawingImages = false;
      system.drawingBlocks = false;
      system.drawingAxis = true;
    break
  }
  
}



function processInput() {

  $('#spanTime').html(_t.toFixed(3));
  $('#spanAmplitude').html((_inputAmplitude*_inputScale).toFixed(3));
  $('#spanFrequency').html(_inputFrequency.toFixed(3));


  if (_isDragging && (_input != "none")) {
    _inputAmplitude -= (mouseY-pmouseY)/height;
    _inputFrequency += (mouseX-pmouseX)/width;
  }



  let amp = _inputAmplitude*_inputScale;

  switch (_input) {

    case "step":
      if (_t>T0) {
        _globalInput = amp;
      }
    break

    case "pulse":
      if (_t>T0) {
        _globalInput = amp;
      }
      if (_t>T0+_inputFrequency) {
        _globalInput = amp;
      }
    break

    case "square":
      if (Math.sin(_t*_inputFrequency)>0)
          _globalInput = amp;
      else
          _globalInput = -amp;
    break

    case "sine":
      _globalInput = amp*Math.sin(_t*_inputFrequency);
    break

    case "noise":
      _globalInput = amp*noise(_t*_inputFrequency);
    break;

  }

}



function init() {
  // implement
}



  function updateValues() {
    // implement
  }


  function updateSystem() {
    // implement
  }





function setup() {
  CANVAS = createCanvas(SCREEN_SIZE_W, SCREEN_SIZE_H/3, WEBGL);
  CANVAS.parent("systemCanvas");  

  $('#osciloscopeDiv').height(SCREEN_SIZE_H/4);

  frameRate(60);

  init();
}



function mousePressed() {
  _hasMousePressed = CLICK_SHOW_TIME;
  if ( Math.abs(mouseY>0)) {
    _isDragging = true;
  }
}


function mouseReleased() {
  _hasMousePressed = CLICK_SHOW_TIME;
  _isDragging = false;
}



function mouseWheel(event) {

  if (keyIsDown(SHIFT)) {
    _cameraDist += event.delta;

  } else {

    _cameraTeta -= event.deltaX/100;
    _cameraPhi += event.deltaY/100;

  }

  return false;
}


var dragAmount = 0
var sawPrize = false
function mouseDragged() {
  if (_isDragging && (_input == "none")) {
    _globalInput += _inputScale*(mouseX - pmouseX)/width;

    // dragAmount += 1
    // if (dragAmount > 100 && !sawPrize) {
    //   alert("Congratulations for using iDynamic! You might earn 1.0 point in the discipline! Send an email to me (allan@dee.ufrn.br) referring to this code: CTRL_I_EA_2020.2. If you happen to be the first three to see this message, congratulations, you earned 1.0 point. If more than 3 people already won, don't give up! There might be mode points hidden in the apps (not only this one)");
    //   sawPrize = true;
    // }
  }

  return false;
}


function drawCursor() {
    var canvas = document.getElementById("2DCanvas");
    var ctx = canvas.getContext("2d");

    ctx.resetTransform();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (_hasMousePressed>0) {

    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    for (var ang = 0.0; ang<2*Math.PI; ang += Math.PI/3) {
      ctx.moveTo( mouseX+1.5*CURSOR_SIZE*Math.cos(ang), mouseY+1.5*CURSOR_SIZE*Math.sin(ang) );
      ctx.lineTo( mouseX+2.5*CURSOR_SIZE*Math.cos(ang), mouseY+2.5*CURSOR_SIZE*Math.sin(ang) );
    }
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#505050';
    ctx.stroke();

    _hasMousePressed--;

    console.log('click');
  }


  if (_isDragging)  {

    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, CURSOR_SIZE, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#505050';
    ctx.stroke();

  }
}



function draw() {
  // implement
}
















