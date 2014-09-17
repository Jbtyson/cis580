// Screen Size
var WIDTH = 800;
var HEIGHT = 480;

// Light Cycle class
//----------------------------------
var LightCycle = function(x, y, direction, color) {
  this.position = {x: x, y: y}
  this.velocity = 0.1;
  this.state = direction;  
  this.color = color;
};

LightCycle.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		context.save();
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.position.x, this.position.y, 5, 0, 2*Math.PI, false);
		context.fill();
		context.restore();
	},
	
	update: function(elapsedTime) {
	
		// Cycle state
		// http://gameprogrammingpatterns.com/state.html
		switch(this.state) {
			case 'left':
				this.position.x -= elapsedTime * this.velocity;
				break;
			case 'right': 
				this.position.x += elapsedTime * this.velocity;
				break;
			case 'up':
				this.position.y -= elapsedTime * this.velocity;
				break;
			case 'down':
				this.position.y += elapsedTime * this.velocity;
				break;
		}
	}	
	
};

// Game class
//----------------------------------
var Game = function (canvasId) {
  var myself = this;
  
  // Rendering variables
  this.screen = document.getElementById(canvasId);
  this.screenContext = this.screen.getContext('2d');
  
  // Game variables
  this.cycles = [
    new LightCycle(100, 240, 'right', 'red'),
	new LightCycle(700, 240, 'left', 'blue')
  ];
  
  // Timing variables
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
		
		// update the cycles
		this.cycles.forEach( function(cycle) {
		  cycle.update(elapsedTime);
		});
		
		// check for collisions with walls
		
		// check for collisions between cycles
		
		// check for collisions between cycle and light path
		
	},
	
	render: function(elapsedTime) {
		self = this;
		
		// Render game objects
		this.cycles.forEach( function(cycle) {
			cycle.render(self.screenContext);
		});
		
		// Render GUI
		
	},
	
	keyDown: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
				this.cycles[0].state = 'left';
				break;
			case 38: // UP
				this.cycles[0].state = 'up';
				break;
			case 39: // RIGHT
				this.cycles[0].state = 'right';
				break;
			case 40: // DOWN
				this.cycles[0].state = 'down';
				break;
			case 87: // W
				this.cycles[1].state = 'up';
				break;
			case 65: // A
				this.cycles[1].state = 'left';
				break;
			case 83: // S
				this.cycles[1].state = 'down';
				break;
			case 68: // D
				this.cycles[1].state = 'right';
				break;
		}
	},
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		
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
		
		if(this.paused || this.gameOver) this.lastTime = time;
		var elapsedTime = time - this.lastTime; 
		this.lastTime = time;
		
		self.update(elapsedTime);
		self.render(elapsedTime);
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}

var game = new Game('gameScreen');
console.log(game);
game.start();