"use strict";
 /************ Design Rules ************

	key:

	0 : nothing
	1 : normal brick
	...
	2 : ice trigger
			surrounding bricks become frozen bricks
	3 : fire trigger
			surrounding bricks become burning bricks
	...
	4 : stone brick
			takes multiple hits to break
	5 : frozen brick
			this brick takes an extra hit to destroy and slows the ball on contact
	6 : burning brick
			this brick becomes invincible while burning for 0.5 seconds and speeds up the ball on contact
	...
	7 : double ball brick
			spawns an extra ball in the field for a short duration
	...
	9 : poison trigger
			surrounding bricks become poisoned bricks
	10: poisoned brick
			burns twice as fast as fire bricks, disintegrates ball on contact
	*/

	/////////////////////////////////////\\ TO DO //\\\\\\\\\\ - [flame alpha sprite rotation, double ball, slow/speed/destroy ball on hit] - (poison particles)

	var canvas = document.querySelector('#canvas1');
	var ctx = this.canvas.getContext('2d');
	var canvas1 = document.querySelector('#canvas2');
	var ctx1 = this.canvas1.getContext('2d');

	canvas.width = app.main.WIDTH;
	canvas.height = app.main.HEIGHT;
	canvas1.width = app.main.WIDTH;
	canvas1.height = app.main.HEIGHT;

	var typeRowAll = [];
	var shapeRowAll = [];
	var map = {};
	var BLOCK = {};
	var blocks = [];
	
	var normalBrickObj = new Image();
		normalBrickObj.src = 'resources/normal_brick.jpg';
	var normalSocketObj = new Image();
		normalSocketObj.src = 'resources/normal_socket.png';
	var iceBrickObj = new Image();
		iceBrickObj.src = 'resources/ice_brick.jpg';
	var stoneBrickObj = new Image();
		stoneBrickObj.src = 'resources/stone_brick.png';
	var iceTriggerObj = new Image();
		iceTriggerObj.src = 'resources/ice_trigger.png';
	var fireTriggerObj = new Image();
		fireTriggerObj.src = 'resources/fire_trigger.png';
	var poisonTriggerObj = new Image();
		poisonTriggerObj.src = 'resources/poison_trigger.png';
	var poisonAlphaObj = new Image();
		poisonAlphaObj.src = 'resources/poison_alpha.png';
	var fireAlpha1Obj = new Image();
		fireAlpha1Obj.src = 'resources/flame_alpha1.png';
	var fireAlpha2Obj = new Image();
		fireAlpha2Obj.src = 'resources/flame_alpha2.png';
	var fireAlpha3Obj = new Image();
		fireAlpha3Obj.src = 'resources/flame_alpha3.png';
	var fireAlpha4Obj = new Image();
		fireAlpha4Obj.src = 'resources/flame_alpha4.png';

function loadNewLevel(level){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	console.log('hello');
	switch(level){
		case 1:
			typeRowAll = level1All;
			break;
		case 2:
			typeRowAll = level2All;
			break;
		case 3:
			typeRowAll = level3All;
			break;
		case 4:
			typeRowAll = level4All;
			break;
		case 5:
			typeRowAll = level5All;
			break;
		default:
			break;
	}

	shapeRowAll = [];

	var temp = [];
	for(var i = 0; i < typeRowAll.length; i++){
		temp = [];
		for(var j = 0; j < typeRowAll[i].length; j++){
			temp.push(null);
		}
		shapeRowAll.push(temp);
	}

	map = {
		numCols : typeRowAll[0].length,
		numRows : typeRowAll.length,
		bottomBricks: [],
		bottomLeft: {},
		bottomRight: {},
		shapes: [],
		playerStamp: 0

	};

	BLOCK = {
		piece : canvas.width / map.numCols,
		height0 : (canvas.height - 175) / map.numRows
	};

	map.shapes = [];
	map.bottomBricks = [];
	blocks = [];

	makeMap1();
	drawMap();
}
function makeMap1(){

	for(var i = 0; i < typeRowAll.length; i++){
		map.shapes.push([]);
		for(var j = 0; j < typeRowAll[i].length; j++){

			if(typeRowAll[i][j] != 0){
				//var pick = getRandomInt(0, app.main.colors.length);
				var temp = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), typeRowAll[i][j], shapeRowAll[i][j], i, j);
				
				//blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j));
				blocks.push(temp);
				//shapeRowAll[i][i] = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j);
				shapeRowAll[i][j] = temp;
				map.shapes[i][j] = temp;
			}
		}
	}// end for loop

	for(var i = 0; i<map.numCols; i++){
		map.bottomBricks.push(null);
	}
	
	findBottom();


}

function Shape(x, y, w, h, type, angle, row, rowIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.angle = angle;
    this.row = row;
    this.rowIndex = rowIndex;
	this.me = this;
    if (this.type == 4) { this.health = 2; }
    else this.health = 1;

    this.lifespan = 1;
    this.burn = false;
    this.poison = false;
    this.otherPortal = null;

    this.beenHit = function(ball) {

    	switch (type)
    	{
    		case 2: // ice trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 5);
    			break;
    		case 3: // fire trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 6);
    			
    			break;
    		case 9: // poison trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 10);
    			break;
    		case 5: // ice brick
    		    // apply chill to ball
    		    //console.log('chill speed slow ball');
    		    //ball.speed *= .75;
    			break;
    		case 6: // fire brick
    			// apply speed boost to ball
    			//console.log('burn speed boost ball');
    			//ball.speed *= 1.5;
    			break;
    		case 10: // poison brick
    			// apply disintigrationg to ball
    			break;
    		case 7: // double ball brick
    			//put another ball in play
    			break;
    		default:
    			break;
    	}
    	this.health -= 1;
    };
    this.firstBurn = true;
    this.lastTick = null;
    this.burnRate = 4000;
    this.tickDOT = function() {
    	if (this.firstBurn) 
    	{ 
    		this.firstBurn = false;
    		this.timer = (new Date()).getTime(); 
    		this.lastTick = (new Date()).getTime(); 
    		//console.log("FIRST BURN || Timer: " + this.timer + ", LastTick: " + this.lastTick);
    	}
    	else
    	{ 
    		this.timer = (new Date()).getTime(); 
    		//console.log("TIMER TICK || Timer: " + this.timer + ", LastTick: " + this.lastTick);
    		if (this.timer > (this.lastTick + this.burnRate)) // burn lasts 4 seconds
			{
				for (var i = 0; i < blocks.length; i++)
				{
					if (blocks[i].burn || blocks[i].poison)
					{
						shapeRowAll[blocks[i].row][blocks[i].rowIndex].lifespan -= .25;
						this.lastTick = date.getTime();
					}
				}
			}
    	}
    };
    this.draw = function() {        
        //bricks
        ctx.drawImage(normalBrickObj, 0 , 0, this.w, this.h);
        
        if (this.type == 5)
        { ctx.drawImage(iceBrickObj, 0 , 0, this.w, this.h); }
    	else if (this.type == 4)
    	{ ctx.drawImage(stoneBrickObj, 0 , 0, this.w, this.h); }
    	else 
    	{ ctx.drawImage(normalBrickObj, 0 , 0, this.w, this.h); }
        
    	//socket
    	if (this.type == 2 || this.type == 3 || this.type == 7 || this.type == 8 || this.type == 9) 
    	{ ctx.drawImage(normalSocketObj, 0, 0, this.w, this.h); }
    	
        //socketed
    	if (this.type == 2)
    	{ ctx.drawImage(iceTriggerObj, 0 + 2, 0 + 1, this.w, this.h); }
    	if (this.type == 3)
    	{ ctx.drawImage(fireTriggerObj, 0 + 2, 0 + 2, this.w, this.h); }
    	if (this.type == 9)
    	{ ctx.drawImage(poisonTriggerObj, 0 + 2, 0 + 1, this.w, this.h); }

        // double ball art placeholder

        //DOTs
    	if (this.burn) 
    	//{ ctx.drawImage(fireAlphaObj, 0, 0, this.w, this.h); }
    	{
    		var burn = function() { console.log("iteration"); }
    		console.log("start burn");
    		setTimeout(burn(), 10000);
    	}
    	if (this.poison)
    	{ ctx.drawImage(poisonAlphaObj, 0, 0, this.w, this.h); }
    
    };
}

function drawMap(){
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.clearRect(0,0, app.main.canvas.width, app.main.canvas.height);
	ctx.fillRect(0,0, app.main.canvas.width, app.main.canvas.height);
	ctx.restore();

	for (var i = 0; i < blocks.length; i++) {
		ctx.save();
		//ctx.fillStyle = blocks[i].fill;
		ctx.translate(blocks[i].x, blocks[i].y);
		if(blocks[i].angle != 0){
			ctx.rotate(blocks[i].angle * Math.PI/180);
		}

		//ctx.fillRect(0, 0, blocks[i].w, blocks[i].h);

		    blocks[i].draw();
	
		
		ctx.restore();
	}

	findBottom();
	app.main.drawHUD(app.main.ctx1);
	
/*
	for(var i = 0; i < shapeRow0.length; i++){
		for(var j = 0; j < shapeRowAll.length; j++){
			if(shapeRowAll[i][j] != null){

			
			ctx.save();
			ctx.fillStyle = shapeRowAll[i][j].fill;
			ctx.translate(shapeRowAll[i][j].x, shapeRowAll[i][j].y);
			if(shapeRowAll[i][j].angle != 0){
				ctx.rotate(shapeRowAll[i][j].angle * Math.PI/180);
			}

			ctx.fillRect(0, 0, shapeRowAll[i][j].w, shapeRowAll[i][j].h);
			
			ctx.restore();
		}

		}

	}
	*/
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function referenceSurroundingBricks(trigger) {
	var xIndexArray = [];
	var yIndexArray = [];
	var referenceArrays = [xIndexArray, yIndexArray];
	// REFERENCE ARRAY OF BRICKS - has two elements, each an array of their respective indexes

	var maxRowIndex = typeRowAll.length;
	var maxWithinRowIndex = typeRowAll[0].length;

	// COMPASS KEY - ifs check if target within map, not null, and is a normal brick
	// NW
	if ((trigger.row > 0) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex - 2); }
	// NW.5
	if ((trigger.row > 0) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex -1] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex -1] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex - 1); }
	// N
	if ((trigger.row > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex); }
	// NE.5
	if ((trigger.row > 0) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row -1][trigger.rowIndex +1] != null)  && (typeRowAll[trigger.row -1][trigger.rowIndex +1] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex + 1); }
	// NE
	if ((trigger.row > 0) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row -1][trigger.rowIndex +2] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex + 2); }
	// E
	if ((trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex +2] != null)&& (typeRowAll[trigger.row][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row); yIndexArray.push(trigger.rowIndex + 2); }
	// SE
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex + 2); }
	// SE.5
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +1] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex +1] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex + 1); }
	// S
	if ((trigger.row <= maxRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex); }
	// SW.5
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row +1][trigger.rowIndex -1] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex -1] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex - 1); }
	// SW
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex - 2); }
	// W
	if ((trigger.rowIndex > 0) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row); yIndexArray.push(trigger.rowIndex - 2); }

	return referenceArrays;
}


function applyEffectsToBricks(bricksArray, effect) // used by elemental triggers
{
	for (var i=0; i < bricksArray[0].length; i++)
	{
		//switches to ice brick type
		typeRowAll[bricksArray[0][i]][bricksArray[1][i]] = effect;
		shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type = effect;

		//element specific effects
		switch (effect)
		{
			//Freeze
			case 5:
				//stops burns and adds defense
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burn = false;
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].health += 1;
				break;
			//Burn
			case 6:
				//ice burns twice as fast as normal
				if (shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type == 5) 
					{ shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burnRate = 2000; }
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burn = true;
				break;
			//Poison
			case 10:
				//twice fire burn speed
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].poison = true;
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burnRate = 2000;
				break;

			default:
				break;
		}
	}
}
function lethalStatusCheck(i, j){
			//find bricks

			if (shapeRowAll[i][j] != null)
			{
				// 0hp kill threshold
				if (shapeRowAll[i][j].health == 0) 
				{ 
					deleteBrick(i, j); 

					return;
				}

				// find bricks affected by DOT
				if (shapeRowAll[i][j].lifespan != 0)
				{
					if (shapeRowAll[i][j].lifespan == 0)
					{
						deleteBrick();
					}
				}
			}
		//}
	//}
}

function deleteBrick(i, j){
	typeRowAll[i][j] = 0;
	shapeRowAll[i][j] = null;
	app.main.totalScore++;


	for(var g = 0; g < blocks.length; g++){
		if((blocks[g].row == i) && (blocks[g].rowIndex == j)){
			blocks.splice(g, 1);
		}
	}
}

function findBottom(){
	var cols = [];
	
	for(var i=0;i<map.bottomBricks.length;i++){
		map.bottomBricks[i] = null;
	}

	var colCheck = function(){
		for(var i=0;i<map.bottomBricks.length;i++){
			if(map.bottomBricks[i] == null){
				return false;
			}else{
				//i+=1;
			}
		}
		//map.rayTurn = map.bottomBricks[map.bottomBricks.length-1].x;
		return true;
	};
	for(var i = shapeRowAll.length - 1; i >= 0;i--){
		if(colCheck() == false){
			for(var j=0;j< blocks.length;j++){
				if(blocks[j].row == i){
					if(map.bottomBricks[blocks[j].rowIndex] == null){
						map.bottomBricks[blocks[j].rowIndex] = blocks[j];
						if(map.bottomBricks[blocks[j].rowIndex + 1] == null)
							map.bottomBricks[blocks[j].rowIndex + 1] = 0;
					}
				}
				/*
				if(shapeRowAll[i][j] != null){
					if(map.bottomBricks[j] == null){
						map.bottomBricks[j] = shapeRowAll[i][j];
						j+=2;
					}
				} */
			}
		}else{
			return;
		}
	}

	var temp = -1;
	var first = true;
	for(var i=0; i<map.bottomBricks.length; i++){
		if(map.bottomBricks[i] == 0){
			continue;
		}
		if(map.bottomBricks[i] == null){
			temp = i;
		}else{
			//console.log("i " + i);
			map.bottomLeft.x = map.bottomBricks[i].x;
			map.bottomLeft.y = +map.bottomBricks[i].y + +map.bottomBricks[i].h;
			break;
		}
	}

	for(var i=map.bottomBricks.length - 1; i>=0; i--){
		if(map.bottomBricks[i] == 0){
			continue;
		}
		if(map.bottomBricks[i] == null){
			temp = i;
		}else{
			map.bottomRight.x = +map.bottomBricks[i].x + +map.bottomBricks[i].w;
			map.bottomRight.y = +map.bottomBricks[i].y + +map.bottomBricks[i].h;
			break;
		}
	}

} // end findBottom()