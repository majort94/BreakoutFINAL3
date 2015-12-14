// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 // hello2
 */
app.main = {
	//  properties
    WIDTH: 1200,
    HEIGHT: 600,
    canvas: undefined,
    canvas1: undefined,
    ctx: undefined,
    ctx1: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: false,
    first: true,
    fps: 0,
    fpsShow: 0,
    paused: false,
    pauseCircles: true,
    // draw map
    doMap: true,
    animationID: 0,
    gameState: undefined,
    roundScore: 0,
    roundGoal: 6,
    level: 1,
    lives: 1,
    player: 0,
    ball: 0,
    MAX_LIVES: 2,
    totalScore: 0,
    colors: ["#FD5B78","#FF6037","#FF9966","#FFFF66","#66FF66","#50BFE6","#FF6EFF","#EE34D2"],
    bgAudio: undefined,
	effectAudio : undefined,
	currentEffect : 0,
	currentDirection : 1,
	effectSounds :
	["1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"],

    CIRCLE:{
    	NUM_CIRCLES_START: 5,
    	NUM_CIRCLES_END: 70,
    	START_RADIUS: 10,
    	MAX_RADIUS: 45,
    	MIN_RADIUS: 2,
    	MAX_LIFETIME: 2.5,
    	MAX_SPEED: 300,
    	backX: 0,
    	backY: 0
    },

    GAME_STATE: Object.freeze({
    	SMALL: 0,
    	BEGIN: 1,
    	DEFAULT: 2,
    	NEXT_LEVEL: 3,
    	REPEAT_LEVEL: 4,
    	END: 5
    }),


   	CIRCLE_STATE: Object.freeze({
   		NORMAL: 0,
   		EXPLODING: 1,
   		MAX_SIZE: 2,
   		IMPLODING: 3,
   		DONE: 4
   	}),

   	circles: [],
   	numCircles: this.NUM_CIRCLES_START,

    
    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('#canvas1');
		this.canvas1 = document.querySelector('#canvas2');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.canvas1.width = this.WIDTH;
		this.canvas1.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		this.ctx1 = this.canvas1.getContext('2d');

		loadNewLevel(this.level);
		//makeMap1();
		
		/* Performance tweaks */
		this.ctx.shadowBlur = 0;
		
		this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
		this.circles = this.makeCircles(this.numCircles);
		//console.log("this.circles = " + this.circles);

		this.gameState = this.GAME_STATE.SMALL;
		//this.canvas.onmousedown = this.domousedown.bind(this);	

		this.bgAudio = document.querySelector("#bgAudio");
		this.bgAudio.volume=0.5;
		this.effectAudio = document.querySelector("#effectAudio");
		this.effectAudio.volume = 0.3;

		

		//this.reset();
		this.totalScore = 0;
		this.lives = this.MAX_LIVES;

		this.player = {
	   		w: 100,
	   		h: 10,
	   		SPEED: 7,
	   		EXTEND: 0,
	   		x: this.canvas.width/2 - 50,
	   		y: this.canvas.height - 10 - 2,
	   		backfill: 0
   		};

   		this.makeMedium();
   		this.gameState = this.GAME_STATE.BEGIN;
		this.update();
	},

	makeFullscreen: function(){
		requestFullscreen(canvas);
		canvas.width= window.innerWidth;
		canvas.height = window.innerHeight;
		app.main.WIDTH = canvas.width;
		app.main.HEIGHT = canvas.height;	
		this.gameState = this.GAME_STATE.BEGIN;
		this.update();
	},


	resize1: function(){
		app.main.gameState = app.main.GAME_STATE.SMALL;
 		app.main.drawHUD(app.main.ctx1);
 		window.removeEventListener("resize", this.resize1);
	},

	setupFullscreen: function(){
		requestFullscreen(canvas);
		canvas.width= window.innerWidth;
		canvas.height = window.innerHeight;
		app.main.WIDTH = canvas.width;
		app.main.HEIGHT = canvas.height;
		this.player = {
	   		w: 35,
	   		h: 10,
	   		SPEED: 3,
	   		EXTEND: 0,
	   		x: 900 / 2,
	   		y: canvas.height - 10 - 2
   		};
   		this.gameState = this.GAME_STATE.BEGIN;
   		//this.drawHUD(this.ctx);
   		makeMap1();
		//this.drawPlayer(this.ctx, this.player);
		this.update();
		//console.log('game ' + this.gameState);
		// start the game loop

	},

	stopBGAudio: function(){
	 	this.bgAudio.pause();
	 	//this.bgAudio.currentTime = 0;
	},

	drawPlayer: function(ctx, player){
		ctx.save();
		//console.log('x ' + player.x);
		//console.log(myKeys.keydown[37]);
		var movePlayer = function(){



		if(myKeys.keydown[myKeys.KEYBOARD.KEY_SPACE]){
			ctx.fillStyle = 'red';
		}else{
			ctx.fillStyle = 'white';

			if(myKeys.keydown[37]){
				// move left
				if(player.x > 0){
					player.x -= player.SPEED;
					player.backFill = 1;
				}
			}
			if(myKeys.keydown[39]){
				// move right
				if(player.x + player.w < canvas.width){
					player.x += player.SPEED;
					player.backFill = 2;
				}
			}
		}


		};
		
		// movePlayer sets the fill
		movePlayer();
		
		//ctx.fillRect(150, 150, 50, 50);
		ctx.fillRect(player.x, player.y, player.w, player.h);

		ctx.fillStyle = 'black';
		switch(player.backFill){
			case 1:
				ctx.clearRect((player.x + player.w), player.y, player.SPEED, player.h);
				ctx.fillRect((player.x + player.w), player.y, player.SPEED, player.h);
				player.backFill = 0;
				break;
			case 2:
				ctx.clearRect((player.x - player.SPEED), player.y, player.SPEED, player.h);
				ctx.fillRect((player.x - player.SPEED), player.y, player.SPEED, player.h);
				player.backFill = 0;
				break;
			default:
				break;
		}
		ctx.restore();


	},

	resetGame: function(){
		//this.level = 0;
		//this.totalScore = 0;
		//this.lives = this.MAX_LIVES;
		//this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
		this.gameState = this.GAME_STATE.BEGIN;
		this.newBall(this.player.x + (this.player.w / 2), this.canvas.height - 50, 0, 0);

		//this.reset();
	},


	reset: function(){
		if(this.gameState == this.GAME_STATE.REPEAT_LEVEL){
			this.gameState = this.GAME_STATE.DEFAULT;
		}else{
			this.numCircles += 5;
			this.level++;
			this.lives = this.MAX_LIVES;
		}
		this.roundScore = 0;
		this.circles = this.makeCircles(this.numCircles);
		
		if(this.numCircles % 2 == 0){
			this.roundGoal = this.numCircles / 2 + this.level;
		}else{
			this.roundGoal = (this.numCircles + 1) / 2 + this.level;
		}
	},

	domousedown: function(e){
		/*console.log("e=" + e);
		console.log("e.target=" + e.target);
		console.log("this=" + this);
		console.log("e.pageX=" + e.pageX);
		console.log("e.pageY=" + e.pageY);
		*/

		this.bgAudio.play();


		if(this.paused){
			this.paused = false;
			this.update();
			return;
		}

		// TSMITH -- Do not return, still needs state checking logic below
		if(this.pauseCircles){
			this.pauseCircles = false;
		}

/* TSMITH - Not needed for breakout
		if(this.gameState == this.GAME_STATE.BEGIN){
			this.gameState = this.GAME_STATE.DEFAULT;
			return;
		}

		*/

		console.log('do something');
		if(this.gameState == this.GAME_STATE.DEFAULT){
			return;
		}
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			//this.pauseCircles = true;
				//this.lives--;
				if(this.lives == 0){
					this.gameState = this.GAME_STATE.END;
					this.stopBGAudio();
				
				//this.gameState = this.GAME_STATE.BEGIN;
				//this.reset();
				return;
			}
		}
		if(this.gameState == this.GAME_STATE.END){
			//this.pauseCircles = true;

			//this.resetGame();
			return;
		}


		var mouse = getMouse(e);
		//this.checkCircleClicked(mouse);
		//console.log("(mouse.x, mouse.y)=" + mouse.x + "," + mouse.y);
	},


checkForCollisions: function(dt){
	"use strict";
		if(this.gameState == this.GAME_STATE.DEFAULT){
			// check for collisions between circles
			for(var i=0;i<this.circles.length; i++){
				var c1 = this.circles[i];
				// did circles leave screen?

				if(this.circleHitLeftRight(c1))
				{
					 c1.xSpeed *= -1;
					 c1.move(dt);
					 return;
				}

				switch(this.circleHitTopBottom(c1)){
					case 0:
						c1.ySpeed *= -1;
						c1.move(dt);
						return;
						break;
					case 1:
						c1.kill();
						if(this.lives != 0){
							this.resetGame();
						}
						//this.drawHUD(this.ctx);
						return;
						break;
					default:
				}

				if((checkIntersect(c1,app.main.player)) && (Date.now() > +map.playerStamp + 200)){
						map.playerStamp = Date.now();
						//this.playEffect();
						c1.ySpeed *= -1;
						calculateAngle(c1);
						return;
						//var x = c1.x+ c1.radius;
						//var y = app.main.player
					}
				
				for(var j = 0; j < blocks.length; j ++){
					if(checkIntersectBlock(c1, blocks[j])){
						if((c1.y < blocks[j].y) || ((c1.y) > +blocks[j].y + +blocks[j].h))
							c1.ySpeed *= -1; 
						if((c1.x < blocks[j].x) || ((c1.x) > +blocks[j].x + +blocks[j].w))
							c1.xSpeed *= -1;
						blocks[j].beenHit();
						lethalStatusCheck(blocks[j].row, blocks[j].rowIndex);
						this.doMap = true;
						//this.drawHUD(this.ctx);
						return;
					}
				}
				
			} // end for

		if(blocks.length == 0){
	 		this.gameState = this.GAME_STATE.NEXT_LEVEL;
	 		setTimeout(function(){myKeys.keyLook = true;}, 500);
	 	}


			/*
			// round over?
			var isOver = true;
			for(var i=0;i<this.circles.length; i++){
				var c = this.circles[i];
				if(c.state != this.CIRCLE_STATE.NORMAL && c.state != this.CIRCLE_STATE.DONE){
				 isOver = false;
				 break;
				}
			} // end for
		
			if(isOver){
				this.stopBGAudio();
				this.gameState = this.GAME_STATE.ROUND_OVER;
				this.totalScore += this.roundScore;
			 }
				*/
		} // end if GAME_STATE_EXPLODING
	},

	playEffect: function (){
		this.effectAudio.src = "media/" + this.effectSounds[this.currentEffect];
		this.effectAudio.play();

		this.currentEffect += this.currentDirection;
		if(this.currentEffect == this.effectSounds.length || this.currentEffect == -1){
			this.currentDirection *= -1;
			this.currentEffect += this.currentDirection;
		}
	},

	checkCircleClicked: function(mouse){
		for(var i = this.circles.length - 1; i >= 0; i--){
			var c = this.circles[i];
			if(pointInsideCircle(mouse.x, mouse.y, c)){
				//c.fillStyle = "red";
				this.playEffect();
				c.xSpeed = c.ySpeed = 0;
				c.state = this.CIRCLE_STATE.EXPLODING;
				this.gameState = this.GAME_STATE.EXPLODING;
				this.roundScore++;
				break;
			}
		}
	},

	drawPauseScreen: function(ctx){
		ctx.save();
		//ctx.fillStyle = "black";
		//ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		//ctx.clearRect(0,0, this.WIDTH, this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText(ctx, "PAUSED", this.WIDTH/2, this.HEIGHT - 100, "40pt courier", "red");
		ctx.restore();
		//window.cancelAnimationFrame(this.animationID);
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
		//this.ctx.clearRect(0,0, this.ctx.width, this.ctx.height);

	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
		
		//if(myKeys.keydown[myKeys.KEYBOARD.KEY_DOWN]){
			//loadNewLevel(5);
		//}
		if((myKeys.anyKey) && (this.gameState == this.GAME_STATE.NEXT_LEVEL)){
			this.level++;
			this.gameState = this.GAME_STATE.DEFAULT;
			this.resetGame();
			loadNewLevel(this.level);
		}
	 	
	 	// 2) PAUSED?
	 	// if so, bail out of loop
	 	if(this.paused){
	 		this.drawPauseScreen(this.ctx1);
	 		window.cancelAnimationFrame(this.animationID);
	 		return;
	 	}

	 	// 4) UPDATE
	 	// move circles.
		// 5) DRAW	
		// i) draw background 
		this.ctx.fillStyle = "black"; 
		this.ctx1.clearRect(0,0, app.main.canvas1.width, app.main.canvas1.height);

		if(this.gameState == this.GAME_STATE.NEXT_LEVEL){
			ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
			this.drawHUD(this.ctx1);
			
			return;
		}
	
		this.ctx.globalAlpha = 0.9;

		//drawMap();
		this.moveCircles(dt);

		//check DOT
		for (var i = 0; i < blocks.length; i ++)
		{
			if (blocks[i].burn || blocks[i].poison)
			{
				shapeRowAll[blocks[i].row][blocks[i].rowIndex].tickDOT();
				lethalStatusCheck(blocks[i].row, blocks[i].rowIndex);	
			}
			
		}

				//check ball brick collisions
		this.checkForCollisions(dt);
		for (var i = 0; i < blocks.length; i ++)
			{ lethalStatusCheck(blocks[i].row, blocks[i].rowIndex);	}

		this.drawCircles(this.ctx1);

		this.drawPlayer(this.ctx1, this.player);

		if(this.doMap){
			drawMap();
			//this.drawHUD();
			this.doMap = false;
		}

		// iii) draw HUD
		//this.ctx.globalAlpha = 1.0;
		this.drawHUD(this.ctx1);

		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx1, "dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
		
	},
	
drawHUD: function(temp){
		temp.save(); // NEW
		temp.globalAlpha = 1.0;
		//temp.clearRect(0,0,canvas1.width, canvas1.height);
		//temp.fillRect(0,0,canvas.width, canvas.height);
		// draw score
      	// fillText(string, x, y, css, color)
	


		this.fillText(temp, "Total Score: " + this.totalScore, 5, this.HEIGHT - 15, "16pt courier", "#ddd");
		this.fillText(temp, "Lives: " + this.lives, this.WIDTH - 125, this.HEIGHT - 15, "16pt courier", "#ddd");
		//this.fillText(temp, "fps " + this.fps.toFixed(3), this.WIDTH / 2, this.HEIGHT - 50, "12pt courier", "red");

		if(this.gameState == this.GAME_STATE.BEGIN){
			temp.textAlign = "center";
			temp.textBaseline = "middle";
			this.fillText(temp, "To begin, Press UP", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
		} // end if
	

		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			this.pauseCircles = true;
			temp.save();
			temp.textAlign = "center";
			temp.textBaseline = "middle";

			this.fillText(temp, "Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			if(this.roundScore >= this.roundGoal){
				this.fillText(temp, "Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
				this.fillText(temp, "Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
			}else{
				this.fillText(temp, "You popped " + this.roundScore + " out of " + this.roundGoal, this.WIDTH/2, this.HEIGHT/2, "30pt courier", "#ddd");
				this.fillText(temp, "You have " +  (this.lives - 1) + " lives remaining", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
			}
		} // end if


		if(this.gameState == this.GAME_STATE.NEXT_LEVEL){
			temp.save();
			temp.textAlign = "center";
			temp.textBaseline = "middle";
			temp.fillStyle = "white";
			temp.globalAlpha = 1;
			this.fillText(temp, "Level Complete!", this.WIDTH/2, this.HEIGHT/2 - 50, "50pt courier", "red");
			this.fillText(temp, "Press Down key to continue", this.WIDTH/2 - 5, this.HEIGHT/2, "28pt courier", "white");

		}
		if(this.gameState == this.GAME_STATE.END){
			temp.save();
			temp.textAlign = "center";
			temp.textBaseline = "middle";
			temp.fillStyle = "black";
			temp.globalAlpha = 1;

		
			if(this.lives != 0){
				this.fillText(temp, "You Win!", this.WIDTH/2, this.HEIGHT/2 - 40, "50pt courier", "red");
			}else{
				this.fillText(temp, "Game Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			}
			this.fillText(temp, "Refesh for a New Game", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
			//this.fillText(this.temp, "Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");

		}
		
		temp.restore(); // NEW
	},
	

	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		//console.log('fps ' + fps);
		fps = clamp(fps, 20, 60);
		if(this.fpsShow % 4 == 0){
			app.main.fps = fps;
			//this.drawHUD(app.main.ctx1);
			this.fpsShow++;
		}else{
			this.fpsShow++;
		}
		this.lastTime = now; 
		return 1/fps;
	},
	
	circleHitLeftRight: function (c){
		if(c.x < c.radius || c.x > this.WIDTH - c.radius){
			return true;
		}
	},

	circleHitTopBottom: function (c){
		if(c.y < c.radius ){
			return 0;
		}else{
			if( c.y > this.HEIGHT - c.radius){
			return 1;
			}else{
				return 2;
		}
	}

	},

	newBall: function(x, y, xSpeed, ySpeed){
		this.makeCircles(1);
		var ball = this.circles[this.circles.length - 1];
		ball.x = x;
		ball.y = y;
		ball.xSpeed = xSpeed;
		ball.ySpeed = ySpeed; 
	},

	makeCircles: function(num){
		var array = [];
		var circleDraw = function(ctx){
			app.main.ctx1.save();


			var newX = 0;
			var newY = 0;
			var newW = this.radius;
			var newH = this.radius;			
			
			app.main.ctx1.beginPath();
			app.main.ctx1.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			app.main.ctx1.closePath();
			app.main.ctx1.fillStyle = 'white';
			app.main.ctx1.fill();
			app.main.ctx1.restore();
		};

		var circleDeath = function(){
			if(app.main.lives !=0){
				app.main.lives--;
			}
			if(app.main.lives == 0){
				app.main.gameState = app.main.GAME_STATE.END;
			}
		};

		var rayCast = function(c, ctx){
			ctx.save()
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#aaa';
			ctx.beginPath();
			ctx.moveTo(c.x, c.y - c.radius);
			var extra = 0;

			var ex = c.ray.inc;
			var y = function(){
				//9console.log('bottom ' + map.bottomBricks);
				for(var k=0; k<map.bottomBricks.length;k++){
					if(c.ray.inc <= map.bottomLeft.x){
						extra = 1;
						return map.bottomLeft.y;
					}
					if((map.bottomBricks[k] == null) || (map.bottomBricks[k] == 0)){
						continue;
					}
					if(c.ray.inc < map.bottomBricks[k].x + (map.bottomBricks[k].w)){
						return +map.bottomBricks[k].y + +map.bottomBricks[k].h;
					}

					if(c.ray.inc >= map.bottomRight.x){
						extra = 2;
						return map.bottomRight.y;
					}

					if(k == (map.bottomBricks.length -1)){
						return 0;
					}
					//console.log('bricks ' + map.bottomBricks);
					//console.log('rayturn ' + map.rayTurn);
					//if(c.inc > map.rayTurn){
					//	c.Inc = false;
					//}
					//if(c.inc < map.rayTurn){
					//	c.Inc = true;
				//	}
				}
			};


			var ey = y(); 
			ctx.lineTo(ex, ey);
			if(extra != 0){
				var slopeTop = ((c.y - c.radius) - ey);
				var slopeBottom = (c.x - ex);
				//ctx.moveTo(ex, ey);
				var newX = ex;
				var newY = ey;

				switch(extra){
					case 1:
						for(var i=0; i<5;i++){
							newY -= slopeTop;
							newX -= slopeBottom;
							if(newX < 0)
								break;
						}
						break;
					case 2:
						for(var i=0; i<5;i++){
							newY -= slopeTop;
							newX -= slopeBottom;
							if(newX > canvas.width)
								break;
						}
						break;
					default:
						break;						
				}

				ctx.lineTo(newX, newY);
			}
			//console.log('y ' + ey);
			//console.log('angle ' + (angle(c.x, c.y, ex, ey) ));
			//console.log('angleDeg ' + (angleDeg(c.x, c.y, ex, ey) ));

			c.ray.angle = angle(c.x, c.y, ex, ey);
			c.ray.angleDeg = angleDeg(c.x, c.y, ex, ey);
			var a = ex - c.x;
			var b = ey - c.y;
			var dist = Math.sqrt( a*a + b*b );
			c.ray.dist = dist;
			//console.log('dist ' + dist);


			if(c.ray.angle < -90){
						var sinX = Math.sin(c.ray.angle);
						var opp = sinX * c.ray.dist;
						var adjX = Math.pow(c.ray.dist,2) - Math.pow(opp,2);
						var adj = Math.sqrt(adjX);

						var cosx = Math.cos(c.ray.angle );
						var adj1 = cosx * c.ray.dist;
						
					}else{
						var sinX = Math.sin(c.ray.angle);
						var opp = sinX * c.ray.dist;
						var adjX = Math.pow(c.ray.dist,2) - Math.pow(opp,2);
						var adj = Math.sqrt(adjX);

						var cosx = Math.cos(c.ray.angle);
						var adj1 = cosx * c.ray.dist;
					}
					

			ctx.stroke();
			ctx.restore();
		};

		var circleMove = function(dt){
			if(app.main.gameState == app.main.GAME_STATE.BEGIN){
				//console.log('here');



				this.x = app.main.player.x + app.main.player.w / 2;

				if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP]){
					//this.ySpeed = -2;
					//this.xSpeed = -.09; 


			if(c.ray.angleDeg < -90){
						var sinX = Math.sin(c.ray.angle);
						var opp = sinX * c.ray.dist;
						var adjX = Math.pow(c.ray.dist,2) - Math.pow(opp,2);
						var adj = Math.sqrt(adjX);

						var cosx = Math.cos(c.ray.angle);
						var adj1 = cosx * c.ray.dist;

						this.ySpeed =  opp/c.ray.dist;
						this.xSpeed =  -1 * adj/c.ray.dist;

						//this.xSpeed = sinX;
						//this.ySpeed = cosx;
						
					}else{
						var sinX = Math.sin(c.ray.angle);
						var opp = sinX * c.ray.dist;
						var adjX = Math.pow(c.ray.dist,2) - Math.pow(opp,2);
						var adj = Math.sqrt(adjX);
						
						var cosx = Math.cos(c.ray.angle);
						var adj1 = cosx * c.ray.dist;

						this.ySpeed =  opp/c.ray.dist;
						this.xSpeed = adj/c.ray.dist;

						//this.xSpeed = sinX;
						//this.ySpeed = cosx;
					}

					app.main.gameState = app.main.GAME_STATE.DEFAULT;
					app.main.drawHUD(app.main.ctx1);
				}

				if(myKeys.keydown[myKeys.KEYBOARD.KEY_SPACE]){
					if(myKeys.keydown[myKeys.KEYBOARD.KEY_LEFT]){
						this.ray.inc -= 15;
					}

					if(myKeys.keydown[myKeys.KEYBOARD.KEY_RIGHT]){
						this.ray.inc += 15;
					}
				}

				rayCast(this,app.main.ctx1);
				
			}
			var xMove = this.xSpeed * this.speed * dt;
			var yMove = this.ySpeed * this.speed * dt;
			this.x += xMove;
			this.y += yMove;
			this.backX = this.x - xMove;
			this.backY = this.y - yMove;
		};
			var c = {};
			c.x = this.canvas.width / 2;
			c.y = this.canvas.height - 50;

			c.radius = this.CIRCLE.START_RADIUS;

			//var randomVector = getRandomUnitVector();
			c.xSpeed = 0;
			c.ySpeed = 0;
			c.backX = 0;
			c.backY = 0;

			c.speed = this.CIRCLE.MAX_SPEED;
			c.fillStyle = 'white';
			c.state = this.CIRCLE_STATE.NORMAL;
			c.lifetime = 0;

			//ray casting stuff
			c.ray = {};
			c.ray.inc = this.canvas.width/2;
			c.ray.Inc = true;
			c.ray.angle = 90;
			c.ray.angleDeg = 90;
			c.ray.dist = 0;


			c.draw = circleDraw;
			c.move = circleMove;
			c.kill = circleDeath;


			Object.seal(c);
			array.push(c);
		
		
		return array;
	},

	drawCircles: function(ctx){
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			this.globalAlpha = 0.25;
		}else{ 
			if(this.gameState == this.GAME_STATE.END){
				this.globalAlpha = 0.1;
			}
		}
		for(var i = 0; i < this.circles.length; i++){
			var c = this.circles[i];
			c.draw(ctx);
		}
	},

	pauseGame: function(){
		this.paused = true;
		//cancelAnimationFrame(this.animationID);
		this.stopBGAudio();
		this.update();
	},

	resumeGame: function(){
		//cancelAnimationFrame(this.animationID);
		this.paused = false;
		this.bgAudio.play();
		this.update();
	},

	moveCircles: function(dt){
		for(var i=0;i<this.circles.length; i++){
			var c = this.circles[i];
		
			// move circles
			c.move(dt);
		

	
		} // end for loop
	},


	makeEasy: function(){
		this.circles[0].speed = 150;
		$("#slider1").progressbar("option", "value", 100);

		this.player.speed = 10;
		$("#slider2").progressbar("option", "value", 100);

		var size = 200;
		if(this.player.w != size){
			this.player.x -= (size - this.player.w)/2;
			this.player.w = size;
			$("#slider3").progressbar("option", "value", 100);
		}
		
	},

	makeMedium: function(){
		this.circles[0].speed = 200;
		$("#slider1").progressbar("option", "value", 50);

		this.player.speed = 7;
		$("#slider2").progressbar("option", "value", 50);

		var size = 125;
		if(this.player.w != size){
			this.player.x -= (size - this.player.w)/2;
			this.player.w = size;
			$("#slider3").progressbar("option", "value", 50);
		}

	},

	makeHard: function(){
		this.circles[0].speed = 275;
		$("#slider1").progressbar("option", "value", 0);

		this.player.speed = 5;
		$("#slider2").progressbar("option", "value", 0);

		var size = 75;
		if(this.player.w != size){
			this.player.x -= (size - this.player.w)/2;
			this.player.w = size;
			$("#slider3").progressbar("option", "value", 0);
		}
	}

    
    
}; // end app.main