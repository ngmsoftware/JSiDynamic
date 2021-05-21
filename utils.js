function drawArrow(base, vec, myColor, weight) {
  push();
  stroke(myColor);
  strokeWeight(weight);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}


function drawLine(x1, y1, z1, x2, y2, z2){
  beginShape();
  vertex(x1,y1,z1);
  vertex(x2,y2,z2);  
  endShape();
}

function drawSpiral(center1X, center2X, height, radius, angle1, angle2, NSegments, weight = 1) {

  var dx = (center2X - center1X)/NSegments;
  var dang = (angle2 - angle1)/NSegments;

  var angle = angle1;

  var p1x = center1X;
  var p1y = height + radius*cos(angle);
  var p1z =  radius*sin(angle);


  fill(255,0);
  beginShape();
  for (var i = 0; i < NSegments; i++) {

    angle += dang;

    p1x += dx;
    p1y = height + radius*cos(angle);
    p1z =  radius*sin(angle);

    strokeWeight(weight);
    vertex(p1x, p1y, p1z);

  }
  endShape();

}


function rotateAxis(v, u, o) {

  let r11 = Math.cos(o) + u[0]*u[0]*(1-Math.cos(o));
  let r12 = u[0]*u[1]*(1-Math.cos(o)) - u[2]*Math.sin(o);
  let r13 = u[0]*u[2]*(1-Math.cos(o)) + u[1]*Math.sin(o);


  let r21 = u[1]*u[0]*(1-Math.cos(o)) + u[2]*Math.sin(o);
  let r22 = Math.cos(o) + u[1]*u[1]*(1-Math.cos(o));
  let r23 = u[1]*u[2]*(1-Math.cos(o)) - u[0]*Math.sin(o);

  let r31 = u[2]*u[0]*(1-Math.cos(o)) - u[1]*Math.sin(o);
  let r32 = u[2]*u[1]*(1-Math.cos(o)) + u[0]*Math.sin(o);
  let r33 = Math.cos(o) + u[2]*u[2]*(1-Math.cos(o));


let res = [v[0]*r11 + v[1]*r21 + v[2]*r31,
           v[0]*r12 + v[1]*r22 + v[2]*r32,
           v[0]*r13 + v[1]*r23 + v[2]*r33];

return res;

}


function drawSpiralVector(p1, p2, radius, angle1, angle2, NSegments, weight = 1) {

  var deltaVec = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2] ];
  var lengthSpring = Math.sqrt(deltaVec[0]*deltaVec[0] + deltaVec[1]*deltaVec[1] + deltaVec[2]*deltaVec[2]);

  deltaVec[0] = deltaVec[0]/lengthSpring;
  deltaVec[1] = deltaVec[1]/lengthSpring;
  deltaVec[2] = deltaVec[2]/lengthSpring;

  var dv = lengthSpring/NSegments;

  var dang = (angle2 - angle1)/NSegments;

  var angle = angle1;


  var normVec = [1.0, 1.0, (-deltaVec[0]-deltaVec[1])/deltaVec[2] ];
  var _tmp = Math.sqrt(normVec[0]*normVec[0] + normVec[1]*normVec[1] + normVec[2]*normVec[2]);

  normVec[0] = normVec[0]/_tmp;
  normVec[1] = normVec[1]/_tmp;
  normVec[2] = normVec[2]/_tmp;


  var p = [p1[0], p1[1], p1[2]];
  var pa = [p1[0], p1[1], p1[2]];

  fill(255,255,255,0);
  beginShape();
  for (var i = 0; i < NSegments; i++) {

    angle += dang;

    p[0] += deltaVec[0]*dv;
    p[1] += deltaVec[1]*dv;
    p[2] += deltaVec[2]*dv;


    let newNormVec = rotateAxis(normVec, deltaVec, angle);

    strokeWeight(weight);
    vertex(p[0] + newNormVec[0]*radius, p[1]+ newNormVec[1]*radius, p[2]+ newNormVec[2]*radius);
//    line(pa[0], pa[1], p2[2], p[0] + newNormVec[0]*radius, p[1]+ newNormVec[1]*radius, p[2]+ newNormVec[2]*radius);

    pa[0] = p[0] + newNormVec[0]*radius;
    pa[1] = p[1] + newNormVec[1]*radius;
    pa[2] = p[2] + newNormVec[2]*radius;

  }
  endShape();

}




function drawDumper(cartPosition, block1Position, cartWidth, blockWidth, y0 = 0) {
    var _t1 =  cartPosition - cartWidth/2 + cartWidth/20;
    var _t2 = block1Position - blockWidth/2;
    var t1 = Math.min(_t1,_t2);
    var t2 = Math.max(_t1,_t2);

    var range = t2-t1;

    rect(t1+range/2, y0-5, 10, 10);

    line(t1, y0, t1+range/2, y0);

    line(t1+range/2+15, y0, t2, y0);

    line(t1+range/2+15, y0-10, t1+range/2+15, y0);
    line(t1+range/2+15, y0+10, t1+range/2+15, y0);
    line(t1+range/2+15, y0-10, t1+range/2-5, y0-10);
    line(t1+range/2+15, y0+10, t1+range/2-5, y0+10);

}




function drawSpring(cartPosition, block1Position, cartWidth, blockWidth, y0 = 0, N = 200) {
    var _t1 =  cartPosition - cartWidth/2 + cartWidth/20;
    var _t2 = block1Position - blockWidth/2;
    var t1 = Math.min(_t1,_t2);
    var t2 = Math.max(_t1,_t2);

    var range = t2-t1;
    var angle = 0;
    var dAngle = 10*2*Math.PI/N;
    fill(255,0);
    beginShape();
    for (var i = 0; i < N; i++) {
      var t = t1+i*(t2-t1)/N;
      angle += dAngle;
      var x1 = t + 6*sin(angle);
      var y1 = 6*cos(angle);
      vertex(x1,  y1+y0);
    }
    endShape();

}



function drawAperture(x, y, Ro, percent, color) {

  stroke(0);
  strokeWeight(2);
  fill(color);

  circle(x, y, Ro);

  stroke(color);
  fill('white');
  
  circle(x, y, Ro*percent);

}


function drawGround(xi, xo, y, color, weigth, N, hair) {

  strokeWeight(weigth);
  stroke(color);

  line(xi,y,xo,y);

  var dx = (xo-xi)/N;
  var x = xi;
  for (var i = 0; i < N; i++) {
    line(x,y, x+hair, y+hair);
    x += dx;
  }

}



function arrowText(str, x1, y1, x2, y2, myColor, weight, size) {

  let sWidth = textWidth(str);

  noStroke();
  fill(myColor);
  textSize(size);
  text(str, x1, y1-2);

  stroke(myColor);

  if (x1>x2)
    drawArrow(createVector(x1,y1), createVector(x2-x1,y2-y1), myColor, weight);
  else
    drawArrow(createVector(x1+sWidth,y1), createVector(x2-x1-sWidth,y2-y1), myColor, weight);

  strokeWeight(weight)    ;
  line(x1,y1,x1+sWidth,y1);

}



function rollArray(someArray) {
  for (var i = 0; i<someArray.length - 1; i++) {
    someArray[i] = someArray[i+1];
  }
}
