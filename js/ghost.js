var App = (function(){
	"use strict";
	var width = null;
	var height = null;
	var canvas = null;
	var ctx = null;
	var AppClient = (function(){
	
		var welcome, background, ghost;
		var state = 'welcome';
		var initialized = false;
		
		var b;// = {x:width/2, y:height/2, angle:updateAngle(), speed: 4};
		var goaldoors;
		//store touches and isDown in mouse object.
		var mouse = {
			touches: [{}],
			isDown: false
		}
		//touch and mouse events
		var inputListeners = {
			// for mobile/touchscreen devices
			touchStart: function(e){onDown(e.touches[0], e.touches);},
			touchMove: function(e){e.preventDefault();onMove(e.touches[0], e.touches)},
			touchEnd: function(e){e.preventDefault();onUp(e.changedTouches[0], e.changedTouches)},
			//for desktop/mouse-based devices
			mouseDown: function(e){onDown(e);},
			mouseMove: function(e){e.preventDefault();onMove(e)},
			mouseUp: function(e){e.preventDefault();onUp(e)}
		};
		//on mouse down or touch start
		function onDown(e, touches){
			var i = 0;
			var len = 0;
			
			if(typeof touches != 'undefined'){
				
				len = touches.length;
				for(i=0;i<len;i++){
					//get the x,y of the touch and store in mouse.touches
					mouse.touches[i] = {x:touches[i].pageX, y:touches[i].pageY};
					//if a touch is on the left hand side of the screen, control the left goaldoor
					if(mouse.touches[i].x < width/2){
						//update left goaldoor y position to the touch y position
						goaldoors.left.y = mouse.touches[i].y;
						//else if the touch is on the right side, control the right goaldoor
					} else {
						//update right goaldoor y position to the touch y position
						goaldoors.right.y = mouse.touches[i] .y;
					}
				}
				//if not touch device but mouse
			} else {
				//set that the mouse is clicked down
				mouse.isDown = true;
				mouse.downPos = {x:e.pageX,y:e.pageY};
				if(mouse.downPos.x < width/2){
				
					goaldoors.left.y = mouse.downPos.y;
				} else {
					
					goaldoors.right.y = mouse.downPos.y;
				}
			}

		}
		//on mouse moving or touch moving
		function onMove(e, touches){
			var i = 0;
			var len = 0;
			//if touch device
			if(typeof touches != 'undefined'){
				//for each touch on the screen, e.g. touch 1 and touch 2.
				len = touches.length;
				for(i=0;i<len;i++){
					mouse.touches[i] = {x:touches[i].pageX, y:touches[i].pageY};
					if(mouse.touches[i].x < width/2){
						goaldoors.left.y = mouse.touches[i].y;
					} else {
						goaldoors.right.y = mouse.touches[i] .y;
					}
				}
			} else {
				//get the x,y position of the mouse
				mouse.movePos = {x:e.pageX,y:e.pageY};
				if(mouse.isDown){
					if(mouse.movePos.x < width/2){
						goaldoors.left.y = mouse.movePos.y;
					} else {
						goaldoors.right.y = mouse.movePos.y;
					}
				}
			}
		}
		//on up - if not a touch device show mouse is released by setting mouse.isDown to false
		function onUp(e, touches){
			if(typeof touches != 'undefined'){

			} else {
				mouse.isDown = false;
			}
		}
		
		function initGame(){
			initialized = true;
			welcome.style.display = 'none';
			document.body.style.backgroundColor = '#1D1D1D';
			background.style.display = 'block';
			ghost.style.display = 'block';
			b = {x:width/2, y:height/2, angle:updateAngle(), speed: 4};
			ghost.style.left = (width/2-ghost.width/2)+'px';//position the ghost image left and top positions to that defined in 'b'.
			ghost.style.top = (height/2-ghost.height/2)+'px';
			//initialize the touch and mouse events as defined in inputListeners
			window.addEventListener('touchstart', inputListeners.touchStart, false);
			window.addEventListener('touchmove', inputListeners.touchMove, false);
			window.addEventListener('touchend', inputListeners.touchEnd, false);
			window.addEventListener('mousedown', inputListeners.mouseDown, false);
			window.addEventListener('mousemove', inputListeners.mouseMove, false);
			window.addEventListener('mouseup', inputListeners.mouseUp, false);
		}

		function changeState(newState){
			if(state == 'welcome' && newState == 'game'){
				if(!initialized){
					initGame();
				}
			}
		}
		
		// store the width and height for collision detection of point and rectangle
		function initPaddles(){
			goaldoors = {
				left:{x:10,y:height/2, width:4, height: height*0.125, score:0},
				right:{x:width-10,y:height/2, width:4, height: height*0.125, score:0}
			};
		}
		
		//set the angle for the ghost as it is initially from the centre of the screen
		function updateAngle(){
			var bln = Math.floor(Math.random()*2);//if 0 then it will move to the left, if 1 then it will move to the right
			if(bln == 0){
				return Math.random()*(Math.PI*0.5)+(Math.PI*0.25);
			} else {
				return Math.random()*(Math.PI*0.5)+(Math.PI*0.25)-Math.PI;
			}
			return Math.random()*Math.PI*2;
		}
		//check if a point (x,y) hits a rectangle (x,y,width,height) - used to detect if the ghost hits the goaldoors
		function pointHitsRect(objPoint, objRect){
			var blnHit = false;
			if(objPoint.x>=objRect.x && objPoint.x<=objRect.x+objRect.width){
				if(objPoint.y>=objRect.y && objPoint.y<=objRect.y+objRect.height){
					blnHit = true;
				}
			}
			return blnHit;
		};
	
		function updateGame(){

			b.x += Math.sin(b.angle)*b.speed;
			b.y += Math.cos(b.angle)*b.speed;
			//if the ghost hits the top of the screen, reflect the angle
			if(b.y < 0){
				b.y = 10;
				b.angle = Math.PI-b.angle;
			}
			//if it hits the bottom of the screen
			if(b.y > height){
				b.y = height-10;
				b.angle = Math.PI-b.angle;
			}
			//if the ghost goes too far left of the screen, add 1 to the score of the right goaldoor and reset the ghost...
			//for center random angle?
			if(b.x < 0){
				goaldoors.right.score ++;
				b.x = width/2;
				b.y = height/2;
				b.angle = updateAngle();
		
			} else if(b.x > width){
				goaldoors.left.score ++;
				b.x = width/2;
				b.y = height/2;
				b.angle = updateAngle();
			}
		
			if(pointHitsRect(b, {x:goaldoors.left.x-2, y:goaldoors.left.y-goaldoors.left.height/2, width:4, height:goaldoors.left.height})){
				b.angle = -b.angle;
				b.angle += Math.random()*Math.PI*0.1-Math.PI*0.05;
			}
			
			if(pointHitsRect(b, {x:goaldoors.right.x-2, y:goaldoors.right.y-goaldoors.right.height/2, width:4, height:goaldoors.right.height})){
				b.angle = -b.angle;
				b.angle += Math.random()*Math.PI*0.1-Math.PI*0.05;
			}
	
			ghost.style.left = (b.x-ghost.width/2)+'px';
			ghost.style.top = (b.y-ghost.height/2)+'px';
		}

		function drawScores(){
			var scoreTextRight = 'Ghost score: '+goaldoors.right.score;
			ctx.font = '20px Georgia';
			ctx.fillStyle = 'rgb(240,240,240)';
			ctx.fillText('Cat score: '+goaldoors.left.score, 24, 24);
			ctx.fillText(scoreTextRight, width-ctx.measureText(scoreTextRight).width-24, 24);
		}

		function drawDivider(){
			ctx.strokeStyle = 'rgb(240,240,240)';
			ctx.setLineDash([10,20]);
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(width/2, 0);
			ctx.lineTo(width/2, height);
			ctx.closePath();
			ctx.stroke();
		}
	
		function drawPaddle(p){
			ctx.strokeStyle = 'rgb(255,255,230)';
			ctx.setLineDash([]);
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(p.x, p.y-p.height/2);
			ctx.lineTo(p.x, p.y+p.height/2);
			ctx.closePath();
			ctx.stroke();
		}
		
		function drawGame(){
			ctx.clearRect(0,0,width,height);
			drawDivider();
			drawPaddle(goaldoors.left);
			drawPaddle(goaldoors.right);
			drawScores();
		}
		var allowLoop = false;
		var frame = 0;
	
		function loop(){
			if(allowLoop){
				updateGame();

				drawGame();
				frame ++;
				requestAnimFrame(loop);
			}
		}

		function beginLoop(){
			allowLoop = true;
			loop();
		}
	
		function endLoop(){
			allowLoop = false;
		}

		function clickedWelcome(){
			initPaddles();
			changeState('game');
			beginLoop();
			canvas.removeEventListener('click', clickedWelcome, false);
		};
	
		function drawWelcome(){
			var msg = 'WELCOME TO GHOST PONG BY ROBAKID';
			var start = 'START GAME';
			ctx.fillStyle = 'rgb(240,240,240)';
			ctx.font = '30px Georgia';
			ctx.fillText(msg, width/2-ctx.measureText(msg).width/2, 96);
			ctx.fillStyle = '#CF61AC';
			ctx.font = '25px Georgia';
			ctx.fillText(start, width/2-ctx.measureText(start).width/2, 300);
			ctx.fillStyle = '#CF61AC';
			ctx.font = '25px Georgia';
			ctx.fillText(start, width/2-ctx.measureText(start).width/2, 300);
			
		}

		function initializeApp(){
		
			if(typeof window.console == 'undefined') {
			  window.console = {log: function (msg) {}, warn: function(msg){}};
			}
		
			window.onerror = function(msg) {
			  console.log("error message:", msg);
			};
			//updates the screen width/height and canvas width/height for responsiveness
			var onWindowResized = function(){
				width = window.innerWidth;
				height = window.innerHeight;
				canvas.width = width;
				canvas.height = height;
			};
		
			var onWindowLoaded = function(){
				console.log("window loaded");
				canvas = document.getElementById('canvas');
				ctx = canvas.getContext('2d');
				onWindowResized();
				welcome = document.getElementById('welcome');
				background = document.getElementById('background');
				ghost = document.getElementById('ghost');
				drawWelcome();
			
				canvas.addEventListener('click', clickedWelcome, false);
			};
			
		
			window.addEventListener('load', onWindowLoaded, false);
			window.addEventListener('resize', onWindowResized, false);
		};
	
		var AppClient = {
		};
		initializeApp();
		return AppClient;
	}());

	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       || 
			  window.webkitRequestAnimationFrame || 
			  window.mozRequestAnimationFrame    || 
			  window.oRequestAnimationFrame      || 
			  window.msRequestAnimationFrame     || 
			  function( callback ){
				window.setTimeout(callback, 1000 / 30);//30 times per second
			  };
	})();
}());