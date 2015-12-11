// All of these functions are in the global scope
		
"use strict";

// returns mouse position in local coordinate system of element
function getMouse(e){
	var mouse = {} // make an object
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}

function getRandom(min, max) {
  	return Math.random() * (max - min) + min;
}


function makeColor(red, green, blue, alpha){
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;
}

// Function Name: getRandomColor()
// returns a random color of alpha 1.0
// http://paulirish.com/2009/random-hex-color-code-snippets/
function getRandomColor(){
	var red = Math.round(Math.random()*200+55);
	var green = Math.round(Math.random()*200+55);
	var blue=Math.round(Math.random()*200+55);
	var color='rgb('+red+','+green+','+blue+')';
	// OR	if you want to change alpha
	// var color='rgba('+red+','+green+','+blue+',0.50)'; // 0.50
	return color;
}

function getRandomUnitVector(){
	var x = getRandom(-1,1);
	var y = getRandom(-1,1);
	var length = Math.sqrt(x*x + y*y);
	if(length == 0){ // very unlikely
		x=1; // point right
		y=0;
		length = 1;
	} else{
		x /= length;
		y /= length;
	}
	
	return {x:x, y:y};
}

function simplePreload(imageArray){
	// loads images all at once
	for (var i = 0; i < imageArray.length; i++) {
		var img = new Image();
		img.src = imageArray[i];
	}
}


function loadImagesWithCallback(sources, callback) {
	var imageObjects = [];
	var numImages = sources.length;
	var numLoadedImages = 0;
	
	for (var i = 0; i < numImages; i++) {
	  imageObjects[i] = new Image();
	  imageObjects[i].onload = function() {
	  	numLoadedImages++;
	  	console.log("loaded image at '" + this.src + "'")
		if(numLoadedImages >= numImages) {
		  callback(imageObjects); // send the images back
		}
	  };
	  
	  imageObjects[i].src = sources[i];
	}
  }


/*
Function Name: clamp(val, min, max)
Author: Web - various sources
Return Value: the constrained value
Description: returns a value that is
constrained between min and max (inclusive) 
*/
function clamp(val, min, max){
	return Math.max(min, Math.min(max, val));
}


 // FULL SCREEN MODE
function requestFullscreen(element) {
	if (element.requestFullscreen) {
	  element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
	  element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
	  element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
	  element.webkitRequestFullscreen();
	}
	// .. and do nothing if the method is not supported
};


// This gives Array a randomElement() method
Array.prototype.randomElement = function(){
	return this[Math.floor(Math.random() * this.length)];
}

function pointInsideCircle(x, y, I){
	var dx = x - I.x;
	var dy = y - I.y;
	return dx * dx + dy * dy <= I.radius * I.radius;
}

function checkIntersect(c1, c2){
	//var dx = c2.x - c1.x;
	//var dy = c2.y - c1.y;
	//var distance = Math.sqrt(dx*dx + dy*dy);
	//return distance < c1.radius + c2.radius;
	if((c1.x - c1.radius < c2.x + c2.w) && (c1.x + c1.radius > c2.x) &&
		(c1.y - c1.radius < c2.y + c2.h) && (c1.y + c1.radius > c2.y)){
		return true;
	}else{ return false;
	}
}

function checkIntersectBlock(c1, c2){
	//var dx = c2.x - c1.x;
	//var dy = c2.y - c1.y;
	//var distance = Math.sqrt(dx*dx + dy*dy);
	//return distance < c1.radius + c2.radius;
	if((c1.x - c1.radius < c2.x + c2.w) && (c1.x + c1.radius > c2.x) &&
		(c1.y - c1.radius < c2.y + BLOCK.height0) && (c1.y + c1.radius > c2.y)){
		return true;
	}else{ return false;
	}
}


function requestFullscreen(element) {
	if (element.requestFullscreen) {
	  element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
	  element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
	  element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
	  element.webkitRequestFullscreen();
	}
	// .. and do nothing if the method is not supported
};


function calculateAngle(c1){
	var middle = app.main.player.x + (.5 * app.main.player.w);
	var tempX = c1.x - app.main.player.x;
	var tempX1 = 0;
	//console.log('yehs ' + tempX);
	//console.log('xspde ' + c1.xSpeed);
	//console.log('c1 ' + c1.x);
	//console.log('player ' + app.main.player.x);

	/*
	if(c1.x < middle){

		if(c1.xSpeed < 0){
			tempX1 = tempX / (app.main.player.w / 2);
			c1.xSpeed = .5 * (-1 + tempX1);
			console.log('1 - tempX1 ' + (1 - tempX1));
		}else{
			tempX1 = tempX / (app.main.player.w / 2);
			c1.xSpeed  = .5 * (1 - tempX1);
			console.log('2 - tempX1 ' + (1 - tempX1));
		}

	}else{
		if(c1.xSpeed < 0){
						tempX1 = (tempX - (app.main.player.w / 2)) / (app.main.player.w / 2);
			c1.xSpeed = .5 * (-1 + tempX1);
			console.log('3 - tempX1 ' + (1 - tempX1));
		}else{
			tempX1 = (tempX - (app.main.player.w / 2)) / (app.main.player.w / 2);
			c1.xSpeed = .5 *  tempX1;
			console.log('4 - tempX1 ' + tempX1);
		}

	}
	*/
	var change = false;
	if(c1.xSpeed < 0){
			tempX1 = tempX / (app.main.player.w);
			if((c1.xSpeed > -.15) && (c1.x > middle)){
				change = true;
				c1.xSpeed -= .4;
			}
			c1.xSpeed -= .4;
			c1.xSpeed *=  (1 - tempX1);
		}else{
			tempX1 = tempX / (app.main.player.w);
			if((c1.xSpeed < .15) && (c1.x < middle)){
				change = true;
				c1.xSpeed += .4;
			}
			c1.xSpeed += .4;
			c1.xSpeed  *=  (tempX1);
		}

		if(change){
			c1.xSpeed *= -1;
			change = false;
			//console.log("Change");
		}
		//console.log('c1.xSpeed ' + c1.xSpeed);
}


function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  //theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

function angleDeg(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}


function loadjsfile(filename){
   var fileref=document.createElement('script');
   fileref.type = "text/javascript";
   fileref.src = filename;
   document.body.appendChild(fileref);
   if (typeof fileref !== 'undefined') {
     // document.getElementsByTagName('head')[0].appendChild(fileref);

      console.log('heee');
   }
}


function loadLevel(level){
	map = level1;
}


var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to 
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};
