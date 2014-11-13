// Screen Size
var WIDTH = 800;
var HEIGHT = 480;
var LEVEL_LENGTH = 14000;
this.level = 1;

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

// Resources
//----------------------------------
Resource = {
	loading: 11,
	Image: {
		spritesheet: new Image(),
		foreground: new Image(),
		midground: new Image(),
		background: new Image(),
		background_night: new Image(),
		midground_fire: new Image(),
	},
	Audio: {
		music: new Audio(),
		bullet: new Audio(),
		missile: new Audio(),
		explosion: new Audio(),
		powerupObtained: new Audio(),
	}
}
function onload() { 
	console.log("Loaded", this);
	Resource.loading -= 1; 
}

Resource.Image.spritesheet.onload = onload;
Resource.Image.foreground.onload = onload;
Resource.Image.midground.onload = onload;
Resource.Image.background.onload = onload;
Resource.Image.background_night.onload = onload;
Resource.Image.midground_fire.onload = onload;

Resource.Audio.music.oncanplaythrough = onload;
Resource.Audio.bullet.oncanplaythrough = onload;
Resource.Audio.missile.oncanplaythrough = onload;
Resource.Audio.explosion.oncanplaythrough = onload;
Resource.Audio.powerupObtained.oncanplaythrough = onload;

Resource.Image.spritesheet.src = "img/helicopter.png";
Resource.Image.foreground.src = "img/foreground.png";
Resource.Image.midground.src = "img/midground.png";
Resource.Image.background.src = "img/background.png";
Resource.Image.background_night.src = "img/background_night.png";
Resource.Image.midground_fire.src = "img/midground_fire.png";

Resource.Audio.music.src = "sfx/before_my_body_is_dry.mp3";
Resource.Audio.bullet.src = "sfx/bullet.wav";
Resource.Audio.missile.src = "sfx/missile.wav";
Resource.Audio.explosion.src = "sfx/explosion.wav";
Resource.Audio.powerupObtained.src = "sfx/powerup_obtained.wav";

Resource.Audio.music.volume = 0.1;
Resource.Audio.music.loop = true;
Resource.Audio.bullet.volume = 0.1;
Resource.Audio.bullet.loop = true;
Resource.Audio.missile.volume = 0.2;
Resource.Audio.explosion.volume = 0.2;
Resource.Audio.powerupObtained.volume = 1;



// Game class
//----------------------------------
var Game = function (canvasId) {
  var myself = this;
  
  // Rendering variables
  this.screen = document.getElementById(canvasId);
  this.screenBounds = this.screen.getBoundingClientRect();
  this.screenContext = this.screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = this.screen.width;
  this.backBuffer.height = this.screen.height;
  this.backBufferContext = this.backBuffer.getContext('2d');
  
  // Parallax variables
  this.cameraOffset = 200;
  this.parallaxLayers = [
	{
		image: Resource.Image.foreground,
		scrollSpeed: 1
	},
	{
		image: Resource.Image.midground_fire,
		scrollSpeed: 0.5
	},
	{
		image: Resource.Image.background_night,
		scrollSpeed: 0.25
	}
  ];
	
  // Input variables	
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false,
		viewportX: 0,
		viewportY: 0,
		worldX: 0,
		worldY: 0,
		firing: false
	};
	
  // Game variables
  this.score = 0;
  this.lives = 3;
  this.health = 100;
  this.gui = new GUI(this);
  this.heli = new Helicopter(this, 200, 200);
  this.targets = [];
  this.bullets = [];
  this.missiles = [];
  this.powerups = [];
	
  // Add enemies
  for(i = 0; i < 100; i++) {
    var target = new Target(
		this,
		Math.random() * (LEVEL_LENGTH - 800) + 400,
		Math.random() * 300 + 50,
		Math.random() * 10
	);
	this.targets.push(target);
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
		var deltaX = this.heli.x, 
			self = this;
		
		// rubberband the camera
		if(this.inputState.right) {
			this.cameraOffset += 5;
		} 
		if(this.inputState.left) {
			this.cameraOffset -= 5;
		}
		this.cameraOffset = Math.max(200, Math.min(WIDTH-500, this.cameraOffset));
		
		// move the helicopter
		this.heli.update(elapsedTime, this.inputState);
		
		// find the change in the helicopter's position
		deltaX = this.heli.x - deltaX;
		this.inputState.worldX += deltaX;
		
		
		// Fire one bullet every 500ms
		this.heli.bulletDelay += elapsedTime;
		if(this.inputState.firing == true && (this.heli.bulletDelay > 100)) {
			this.heli.fireBullet(this.inputState.worldX, this.inputState.worldY);
			this.heli.bulletDelay = 0;
		}
		
		// Update the bullets
		this.bullets.forEach( function(bullet, index, arr) {
			bullet.update(elapsedTime);
			// Remove off-screen bullets
			if(bullet.y > HEIGHT || bullet.y < 0 || bullet.x > LEVEL_LENGTH)
				arr = arr.splice(index, 1);
		});
		
		// Update the missiles
		this.missiles.forEach( function(missile, index, arr) {
			missile.update(elapsedTime);
			// Remove any exploded missiles
			if(missile.state === "dead")
				arr = arr.splice(index, 1);
		});
		
		// Update the targets
		this.targets.forEach( function(target) {
			target.update(elapsedTime);
		});
		
		// Update the powerups
		this.powerups.forEach( function(powerup, index, arr) {
			powerup.update(elapsedTime);
			if(powerup.state == "dead")
				arr = arr.splice(index, 1);
		});
		
		// Bound helicopter to screen
		if(this.heli.x < 0) this.heli.x = 0;
		
		// Check for collisions
		this.targets.forEach( function(target, targetIndex, targetArr) {
			// Check for bullet collision
			self.bullets.forEach( function(bullet) {
				if(Math.pow(bullet.x - target.x, 2) + Math.pow(bullet.y - target.y, 2) <= Math.pow(target.radius, 2)) {
					// Remove the target from the world
					//remove this
					self.powerups.push(new Powerup(self, target.x, target.y, "random"));
					targetArr = targetArr.splice(targetIndex, 1);
					self.score += 10;
				}
			});
			// check for missile collision
			self.missiles.forEach( function(missile) {
				if(missile.state === "exploding" &&
				  Math.pow(missile.x - target.x, 2) + Math.pow(missile.y - target.y, 2) <= Math.pow(target.radius, 2) + Math.pow(missile.radius, 2)) {
					// remove the target from the world
					targetArr = targetArr.splice(targetIndex, 1);
					self.score += 10;
				}
			});
		});
				
	},
	
	render: function(elapsedTime) {
		var self = this;
			
		
		// Clear the screen
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		
		// Render background
		this.backBufferContext.save();
		this.backBufferContext.translate(Math.min(this.cameraOffset-this.heli.x, 0) * this.parallaxLayers[2].scrollSpeed, 0);
		this.backBufferContext.drawImage(this.parallaxLayers[2].image, 0, 0);
		this.backBufferContext.restore();

		// Render midground
		this.backBufferContext.save();
		this.backBufferContext.translate(Math.min(this.cameraOffset-this.heli.x,0) * this.parallaxLayers[1].scrollSpeed, 0);
		this.backBufferContext.drawImage(this.parallaxLayers[1].image, 0, 0);
		this.backBufferContext.restore();
		
		// Render foreground				
		this.backBufferContext.save();
		this.backBufferContext.translate(Math.min(this.cameraOffset-this.heli.x,0), 0);
		this.backBufferContext.drawImage(this.parallaxLayers[0].image, 0, 0);
		
		// Render game objects
		this.heli.render(this.backBufferContext);
		this.targets.forEach( function(target) {
			target.render(self.backBufferContext);
		});
		this.bullets.forEach( function(bullet) {
			bullet.render(self.backBufferContext);
		});
		this.missiles.forEach( function(missile) {
			missile.render(self.backBufferContext);
		});
		this.powerups.forEach( function(powerup) {
			powerup.render(self.backBufferContext);
		});

		// Restore render state
		this.backBufferContext.restore();

		// Render reticule
		var rx = Math.floor(this.inputState.viewportX),
			ry = Math.floor(this.inputState.viewportY);
		this.backBufferContext.save();
		this.backBufferContext.strokeStyle = "red";
		this.backBufferContext.beginPath();
		this.backBufferContext.arc(rx, ry, 5, 0, 2*Math.PI);
		this.backBufferContext.moveTo(rx + 8, ry);
		this.backBufferContext.lineTo(rx + 2, ry);
		this.backBufferContext.moveTo(rx - 2, ry);
		this.backBufferContext.lineTo(rx - 8, ry);
		this.backBufferContext.moveTo(rx, ry + 8);
		this.backBufferContext.lineTo(rx, ry + 2);
		this.backBufferContext.moveTo(rx, ry - 2);
		this.backBufferContext.lineTo(rx, ry - 8);
		this.backBufferContext.stroke();
		this.backBufferContext.restore();
		
		// Render GUI
		this.gui.render(this.backBufferContext);
		
		
		//this.backBufferContext.drawImage(this.backBuffer, 0, 0, WIDTH, 50);
		
		// Flip buffers
		this.screenContext.drawImage(this.backBuffer, 0, 0);
	},
	
	keyDown: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
			case 65: // A
				this.inputState.left = true;
				break;
			case 38: // UP
			case 87: // W
				this.inputState.up = true;
				break;
			case 39: // RIGHT
			case 68: // D
				this.inputState.right = true;
				break;
			case 40: // DOWN
			case 83: // S
				this.inputState.down = true;
				break;
		}
	},
	
	keyUp: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
			case 65: // A
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
	
	mouseMove: function(e) {
		this.inputState.viewportX = e.clientX - this.screenBounds.left;
		this.inputState.viewportY = e.clientY - this.screenBounds.top;
		this.inputState.worldX = this.inputState.viewportX + this.heli.x - this.cameraOffset;
		this.inputState.worldY = this.inputState.viewportY
	},
	
	mouseDown: function(e){
		this.mouseMove(e);
		switch(e.button) {
			case 0:
				this.inputState.firing = true;
				Resource.Audio.bullet.play();
				break;
			case 2:
				this.heli.fireMissile(this.inputState.worldX, this.inputState.worldY);
				break;
		};
	},
	
	mouseUp: function(e){
		this.mouseMove(e);
		if(e.button === 0) {
			this.inputState.firing = false;
			Resource.Audio.bullet.pause();
			Resource.Audio.bullet.currentTime = 0;
		}
	},
	
	start: function() {
		var self = this;
		
		Resource.Audio.music.play();
		
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		window.onmousemove = function (e) { self.mouseMove(e) };
		window.onmousedown = function(e) { self.mouseDown(e) };
		window.onmouseup = function(e) { self.mouseUp(e) };
		this.screen.oncontextmenu = function (e) { return false; };
		
		this.startTime = Date.now();
		
		this.gui.message("Begin!");
		setTimeout( function() {
			self.gui.message("")
		}, 3000);
		
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
function waitForLoad() {
	if(Resource.loading === 0) {
		game.start();
	} else {
		setTimeout(waitForLoad, 1000);
	}
};
waitForLoad();