// Screen Size
var WIDTH = 800;
var HEIGHT = 480;

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

// RESOURCES
// ----------------------------------
var Resource = { img: {}, sfx: {}}

Resource.img.reticle = new Image();
Resource.img.reticle.src = "img/reticle.png";
Resource.img.background = new Image();
Resource.img.background.src = "img/background.png";
Resource.img.middleground = new Image();
Resource.img.middleground.src = "img/midground.png";
Resource.img.foreground = new Image();
Resource.img.foreground.src = "img/foreground.png";

//Resource.sfx.collide = new Audio();
//Resource.sfx.collide.src = "collide.wav";

// Game class
//----------------------------------
var Game = function (canvasId) {
	var myself = this;
	
	// Rendering variables
	this.screen = document.getElementById(canvasId);
	this.screenContext = this.screen.getContext('2d');
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.screen.width;
	this.backBuffer.height = this.screen.height;
	this.backBufferContext = this.backBuffer.getContext('2d');
	
	this.mouse = { x:0, y:0 }
	this.mouseOffset = { x:25, y:82 }
	
	// Background variables
	this.backgroundSpeed = 0.25;
	this.midgroundSpeed = 0.5571;
	this.foregroundSpeed = 1;
	this.sx = 0;
	this.sy = 0;
	this.scrolling = { left:false, right:false };
	
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false	
	};
	
	// Game variables
	this.gui = new GUI(this);
	this.grid = new Grid(WIDTH, HEIGHT);
	this.heli = new Helicopter(this, 200, 200, this.grid);
	this.score = 0;

	// Add enemies
	this.enemies = [];
	for(i = 0; i < 20; i++) {
		this.enemies.push(new Target(i * 500 + 600, 200 + Math.random()*100, this.scrolling, this));
	}

	// Timing variables
	this.elapsedTime = 0.0;
	this.startTime = 0;
	this.lastTime = 0;
	this.gameTime = 0;
	this.fps = 0;
	this.STARTING_FPS = 60;
	
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		var grid = this.grid
		
		// update heli/bullets/missiles
		this.heli.update(elapsedTime, this.inputState);
		
		// update enemies
		this.enemies.forEach(function(enemy) {
			enemy.update(elapsedTime);
			if(enemy.destroyed == true) {
				self.grid.remove(enemy);
				index = self.enemies.indexOf(enemy);
				self.enemies.splice(index, 1);
			}
		});
		
		//check for collisions
		this.grid.move(this.heli);
		this.heli.bullets.forEach( function(bullet) {
			grid.move(bullet);
		});
		this.heli.missiles.forEach( function(missile) {
			grid.move(missile);
		});
		this.enemies.forEach( function(enemy) {
			grid.move(enemy);
		});
		// iterate through all of the cells
		for(i = 0; i < this.grid.length; i++) {
			this.grid.handleCell(i);
		}
		
		// update the gui
		this.gui.update(elapsedTime);
	},
	
	render: function(elapsedTime) {
		var self = this;
		
		// clear the screen and draw the backgrounds
		this.backBufferContext.fillStyle = "#000";
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		this.backBufferContext.drawImage(Resource.img.background, this.sx * this.backgroundSpeed, this.sy, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
		this.backBufferContext.drawImage(Resource.img.middleground, this.sx * this.midgroundSpeed, this.sy, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
		this.backBufferContext.drawImage(Resource.img.foreground, this.sx * this.foregroundSpeed, this.sy, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
		
		// Render game objects
		context = this.backBufferContext;
		this.enemies.forEach(function(enemy) {
			enemy.render(context);
		});
		this.heli.render(this.backBufferContext);
		
		// Render the reticle
		this.backBufferContext.drawImage(Resource.img.reticle, this.mouse.x, this.mouse.y);
		
		// Render GUI
		this.gui.render(this.backBufferContext);
		
		// Flip buffers
		this.screenContext.drawImage(this.backBuffer, 0, 0);
	},
	
	keyDown: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
				this.inputState.left = true;
				break;
			case 38: // UP
				this.inputState.up = true;
				break;
			case 39: // RIGHT
				this.inputState.right = true;
				break;
			case 40: // DOWN
				this.inputState.down = true;
				break;
		}
	},
	
	keyUp: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
			case 65: // W
				this.inputState.left = false;
				break;
			case 38: // UP
			case 87: // W
				this.inputState.up = false;
				break;
			case 39: // RIGHT
			case 68: // D
				this.inputState.right = false;
				break;
			case 40: // DOWN
			case 83: // S
				this.inputState.down = false;
				break;
		}
	},
	
	moveMouse: function(e) {
		// get mouse coordinates
		this.mouse.x = e.clientX - this.mouseOffset.x;
		this.mouse.y = e.clientY - this.mouseOffset.y;
	},
	
	mouseDown: function(e) {
		// handle mouse down
		this.heli.handleClick(e, this.mouse);
	},
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		window.onmousemove = function (e) { self.moveMouse(e); };
		window.onmousedown = function (e) { self.mouseDown(e); };
		window.onmouseup = function (e) { self.heli.handleMouseUp(e); };
		window.oncontextmenu = function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};	
		
		this.startTime = Date.now();
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},
	
	// The game loop.  See
	// http://gameprogrammingpatterns.com/game-loop.html
	loop: function(time) {
		var self = this;
		
		// Don't advance the clock if the game is paused		
		if(this.paused || this.gameOver) this.lastTime = time;
		
		// Calculate additional elapsed time, keeping any
		// unused time from previous frame
		this.elapsedTime += time - this.lastTime; 
		this.lastTime = time;
		
		// The first timestep (and occasionally later ones) are too large
		// causing our processing to take too long (and run into the next
    // frame).  We can clamp to a max of 4 frames to keep that from 
    // happening		
		this.elapsedTime = Math.min(this.elapsedTime, 4 * TIME_STEP);
		
		// We want a fixed game loop of 1/60th a second, so if necessary run multiple
		// updates during each rendering pass
		// Invariant: We have unprocessed time in excess of TIME_STEP
		while (this.elapsedTime >= TIME_STEP) { 
			self.update(TIME_STEP);
			this.elapsedTime -= TIME_STEP;
			
			// add the TIME_STEP to gameTime
			this.gameTime += TIME_STEP;
		}
		
		// We only want to render once
		self.render(this.elapsedTime);
		
		// Repeat the game loop
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}

var game = new Game('game');
console.log(game);
game.start();