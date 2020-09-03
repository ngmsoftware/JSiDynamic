  function help() {

    showHelp($('#tableSystemParameters'), '\
In this block you can change all the parameters of the system. Use the sliders to change stuff like mass, friction, gravity, etc.\
    ',()=>{

    showHelp($('#inputSelect'), ' \
Here you can select the input you want to use in the system.<br><br> Leave it blank to give arbitrary input by dragging the mouse on the system.\
    ',()=>{

    showHelp($('#playButton'), '\
Click here to start the simulation \
  ',()=>{

    showHelp($('#resetButton'), '\
Reset everything (basically reloads the page)\
    ',()=>{

    showHelp($('#divControl'), ' \
This is a special control mechanism that requires a external client. This is used to allow an external program to control the system via WebSocket. More info later...\
    ',()=>{

    showHelp($('#tdInfo'), ' \
Here you can check the current time, amplitude and frequency of the input signal applied to the system\
    ',()=>{

    showHelp($('#tdDisplayType'), '\
Here you can change how the system is renderized. Each one adds some level of detail and representation.\
  ',()=>{

    showHelp($('#systemCanvas'), '\
Here is the main canvas. You can interact with the system and see its simulation according to the level of detailed chosen on display options.<br><br>\
<ul>\
<li>Drag the mouse left - right to change in the input signal amplitude. Depending on the system this corresponds to different actions. For mechanical systems, this corresponds to drag the position of apply a force, for instance. </li>\
<li>If you have some input, dragging horizontally will increase the frequency of that input and dragging vertically will change its amplitude</li>\
<li>For 3D rendering, use the mouse wheels to change the angle of the camera. Wheel vertically to change angle and horizontally to change tilt. Control-wheel to zoom in or out</li>\
<li>In general, colors are representative. If a block is red, the variable corresponding to it will be shown in red in the plot</li>\
</ul>\
    ',()=>{

    showHelp($('#osciloscopeDiv'), ' \
This is the main oscilloscope. Here you can see the plot for the dynamical variables of the system. Colors in general match the canvas elements. A blue plot will represent the value of a blue element in the system representation\
    ',()=>{


    }, null, 1, 800);

    }, null, 0, 1000);

    });

    });

    });

    });

    });

    });

    });
  }
