var App = (function(){
	var width = null;
	var height = null;
	var canvas = null;
	var ctx = null;
	var AppClient = (function(){
		var welcome, background, ghost;
		var state = 'welcome';
		var initialized = false;
		var numTouchesOnScreen = 0;
		var mouse = {
			touches: [{}],
			isDown: false
		}

		function onDown(e, touches){
			var i = 0;
			var len = 0;
			if(typeof touches != 'undefined'){
				len = touches.length;
				for(i=0;i<len;i++){
					mouse.touches[i] = {x:touches[i].pageX, y:touches[i].pageY};
					if(mouse.touches[i].x < width/2){
						//left goaldoor
						goaldoors.left.y = mouse.touches[i].y;
					} else {
						//right goaldoor
						goaldoors.right.y = mouse.touches[i] .y;
					}
				}
			} else {
				mouse.isDown = true;
				mouse.downPos = {x:e.pageX,y:e.pageY};
				if(mouse.downPos.x < width/2){
					//left goaldoor
					goaldoors.left.y = mouse.downPos.y;
				} else {
					//right goaldoor
					goaldoors.right.y = mouse.downPos.y;
				}
			}

		}

		function onMove(e, touches){
			var i = 0;
			var len = 0;
			if(typeof touches != 'undefined'){
				len = touches.length;
				for(i=0;i<len;i++){
					mouse.touches[i] = {x:touches[i].pageX, y:touches[i].pageY};
					if(mouse.touches[i].x < width/2){
						//left goaldoor
						goaldoors.left.y = mouse.touches[i].y;
					} else {
						//right goaldoor
						goaldoors.right.y = mouse.touches[i] .y;
					}
				}
			} else {
				mouse.movePos = {x:e.pageX,y:e.pageY};
				if(mouse.isDown){
					if(mouse.movePos.x < width/2){
						//left goaldoor
						goaldoors.left.y = mouse.movePos.y;
					} else {
						//right goaldoor
						goaldoors.right.y = mouse.movePos.y;
					}
				}
			}
		}
		function onUp(e, touches){
			if(typeof touches != 'undefined'){

			} else {
				mouse.isDown = false;
			}
		}
		var inputListeners = {
			touchStart: function(e){onDown(e.touches[0], e.touches);},
			touchMove: function(e){e.preventDefault();onMove(e.touches[0], e.touches)},
			touchEnd: function(e){e.preventDefault();onUp(e.changedTouches[0], e.changedTouches)},

			/*pointerUp: function(e){//console.log("touchStart");onDown(e.touches[0], e.touches);},
			touchMove: function(e){if(this.blnPreventDefaultMove){e.preventDefault();}onMove(e.touches[0], e.touches)},
			pointerDown: function(e){e.preventDefault();onUp(e.changedTouches[0], e.changedTouches)},
	*/
			mouseDown: function(e){onDown(e);},
			mouseMove: function(e){e.preventDefault();onMove(e)},
			mouseUp: function(e){e.preventDefault();onUp(e)}
		};
		function initGame(){
			initialized = true;
			welcome.style.display = 'none';
			document.body.style.backgroundColor = '#1D1D1D';
			background.style.display = 'block';
			ghost.style.display = 'block';
			b = {x:width/2, y:height/2, angle:updateAngle(), speed: 4};
			ghost.style.left = (width/2-ghost.width/2)+'px';
			ghost.style.top = (height/2-ghost.height/2)+'px';
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
		var goaldoors;
		function initgoaldoors(){
			goaldoors = {
				left:{x:10,y:height/2, width:4, height: height*0.125, size:height*0.125, score:0},
				right:{x:width-10,y:height/2, width:4, height: height*0.125, size:height*0.125, score:0}
			};
		}
		var b = {x:width/2, y:height/2, angle:updateAngle(), speed: 4};
		function updateAngle(){
			var bln = Math.floor(Math.random()*2);
			if(bln == 0){
				//left
				return Math.random()*(Math.PI*0.5)+(Math.PI*0.25);
			} else {
				//right
				return Math.random()*(Math.PI*0.5)+(Math.PI*0.25)-Math.PI;
			}
			return Math.random()*Math.PI*2;
		}
		function pointHitsRect(objPoint, objRect){
			var blnHit = false;
			if(objPoint.x>=objRect.x && objPoint.x<=objRect.x+objRect.width){
				if(objPoint.y>=objRect.y && objPoint.y<=objRect.y+objRect.height){
					blnHit = true;
				}
			}
			return blnHit;
		};
		var hits = 0;
		function updateGame(){
			b.x += Math.sin(b.angle)*b.speed;
			b.y += Math.cos(b.angle)*b.speed;
			/*if(b.angle < 0){
				if(b.y < 0){
					b.y = 10;
					hits ++;
					if(hits%2==0){
						b.angle += Math.PI/2;
					} else {
						b.angle -= Math.PI/2;
					}
				}
				if(b.y > height){
					b.y = height-10;
					hits ++;
					if(hits%2==0){
						b.angle -= Math.PI/2;
					} else {
						b.angle += Math.PI/2;
					}
				}
			} else if(b.angle > 0){
				if(b.y < 0){
					b.y = 10;
					hits ++;
					if(hits%2==0){
						b.angle -= Math.PI/2;
					} else {
						b.angle += Math.PI/2;
					}
				}
				if(b.y > height){
					b.y = height-10;
					hits++;
					if(hits%2==0){
						b.angle += Math.PI/2;
					} else {
						b.angle -= Math.PI/2;
					}
				}
			}*/
			if(b.y < 0){
				b.y = 10;
				b.angle = Math.PI-b.angle;
			}
			if(b.y > height){
				b.y = height-10;
				b.angle = Math.PI-b.angle;
			}
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
			ctx.font = "20px Georgia";
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
		function drawgoaldoor(p){
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
			drawgoaldoor(goaldoors.left);
			drawgoaldoor(goaldoors.right);
			drawScores();
		}
		var allowLoop = false;
		var frame = 0;
		function loop(){
			if(allowLoop){
				//start loop code here--
				updateGame();

				drawGame();
				frame ++;
				//--end loop code here
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
			initgoaldoors();
			changeState('game');
			beginLoop();
			canvas.removeEventListener('click', clickedWelcome, false);
		};
		function initializeApp(){

			if(typeof window.console == 'undefined') {
			  window.console = {log: function (msg) {}, warn: function(msg){}};
			}
			window.onerror = function(msg) {
			  console.log("error message:", msg);
			};
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
				canvas.addEventListener('click', clickedWelcome, false);
			};

			//Initialize program
			//document.addEventListener("deviceready", onDeviceReady, false);
			window.addEventListener('load', onWindowLoaded, false);
			window.addEventListener('resize', onWindowResized, false);
		};
		//exports
		var AppClient = {
		};
		initializeApp();//Auto initializes self (load) if this module is in the code
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
