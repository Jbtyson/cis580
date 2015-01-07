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
  this.leftProtected = false;
  this.rightProtected = false;
  this.collPoint = {x: 0, y: 0}
  this.updateCollPoint();
  this.loser = false;
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
	},

	setState: function(e) {
		// change blue cycle
		if(this.color === "blue") {
			switch(e.keyCode){
			case 37: // LEFT
				if(this.state === "right") {
					return;
				}
				this.state = 'left';
				break;
			case 38: // UP
				if(this.state === "down") {
					return;
				}
				this.state = 'up';
				break;
			case 39: // RIGHT
				if(this.state === "left") {
					return;
				}
				this.state = 'right';
				break;
			case 40: // DOWN
				if(this.state === "up") {
					return;
				}
				this.state = 'down';
				break;
			}
		}
		
		// change red cycle
		else {
			switch(e.keyCode){
				case 87: // W
					if(this.state === "down") {
						return;
					}
					this.state = 'up';
					break;
				case 65: // A
					if(this.state === "right") {
						return;
					}
					this.state = 'left';
				break;
				case 83: // S
					if(this.state === "up") {
						return;
					}
					this.state = 'down';
					break;
				case 68: // D
					if(this.state === "left") {
						return;
					}
					this.state = 'right';
					break;
			}
		}
	},
	
	updateCollPoint: function() {
		switch(this.state) {
			case "up":
				this.collPoint.x = this.position.x;
				this.collPoint.y = this.position.y - 5;
				break;
			case "left":
				this.collPoint.x = this.position.x - 5;
				this.collPoint.y = this.position.y;
				break;
			case "down":
				this.collPoint.x = this.position.x;
				this.collPoint.y = this.position.y + 5;
				break;
			case "right":
				this.collPoint.x = this.position.x + 5;
				this.collPoint.y = this.position.y;
				break;
		}
	},
	
	isOutOfBounds: function() {
		if(this.position.x > WIDTH || this.position.x < 0 || this.position.y > HEIGHT || this.position.y < 0) {
			this.loser = true;
			return true;
		}
		else {
			return false;
		}
	},
	
	collideWithLightTrail: function(screenContext) {
		//update the collision point and get the image data
		this.updateCollPoint();
		var imageData = screenContext.getImageData(this.collPoint.x, this.collPoint.y, 1, 1)
		
		// check if the pixel is neither white or black
		if((imageData.data[0] === 255 || imageData.data[2] === 255) && imageData.data[1] !== 255) {
			this.loser = true;
			return true;
		}
		return false;
	}
};

// Game class
//----------------------------------
var Game = function (canvasId, timerId) {
  var myself = this;
  
  // Rendering variables
  this.screen = document.getElementById(canvasId);
  this.screenContext = this.screen.getContext('2d');
  this.timer = document.getElementById(timerId);
  this.timerContext = this.timer.getContext('2d');
  
  // Game variables
  this.cycles = [
    new LightCycle(100, 240, 'right', 'red'),
	new LightCycle(700, 240, 'left', 'blue')
  ];
  
  // Timing variables
  this.startTime = 0;
  this.currentTime = 0;
  this.lag = 0;
  this.gameTime = 0;
  this.oldGameTime = -1;
  this.fps = 60;
  this.frameDuration = 1000 / this.fps;
  this.winner = ""
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime, screenContext, timerContext) {
		
		// update the cycles
		this.cycles.forEach( function(cycle) {
			cycle.update(elapsedTime);
		});
		
		// check for collisions with walls
		this.cycles.forEach( function(cycle) {
			if(cycle.isOutOfBounds()) {
				self.gameOver = true;
				cycle.loser = true;
			}		
		});	
		
		// check for collisions between cycle and light path
		this.cycles.forEach( function(cycle) {
			if (cycle.collideWithLightTrail(screenContext)) {
				self.gameOver = true;
				cycle.loser = true;
				
				// check for collisions between cycles
				if(self.cycles[0].position.x - self.cycles[1].position.x <= 10 && self.cycles[0].position.y - self.cycles[1].position.y <= 10 && self.cycles[0].position.x - self.cycles[1].position.x >= 0 && self.cycles[0].position.y - self.cycles[1].position.y >= 0) {
					self.cycles[0].loser = true;
					self.cycles[1].loser = true;
		}
			}
		});
	},
	
	render: function(elapsedTime) {
		self = this;
		
		// Render game objects
		this.cycles.forEach( function(cycle) {
			cycle.render(self.screenContext);
		});
		
		// Render GUI
		if(Math.round(self.gameTime) !== Math.round(self.oldGameTime)) {
			self.timerContext.clearRect(0, 0, WIDTH, 30);
			self.timerContext.fillStyle = '#000000';
			self.timerContext.font = "20px Arial";
			self.timerContext.fillText("Game time: " + Math.round(this.gameTime), 20, 20);
			this.oldGameTime = this.gameTime;
		}
		if(self.gameOver && self.winner === "") {
			if(this.cycles[0].loser && !this.cycles[1].loser) {
				self.winner = this.cycles[1].color + " wins!";
			}
			else if(this.cycles[1].loser && !this.cycles[0].loser) {
				self.winner = this.cycles[0].color + " wins!";
			}
			else {
				self.winner = "No winner!"
			}
			self.timerContext.fillStyle = '#000000';
			self.timerContext.font = "20px Arial";
			self.timerContext.fillText(self.winner, 200, 20);
		}
	},
	
	keyDown: function(e) {
		// Cycle state is set directly 
		this.cycles.forEach(function (cycle) {
			cycle.setState(e)
		});
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
		
		if(this.gameOver) {
			this.startTime = time;
		}
		
		this.currentTime = Date.now();
		var elapsedTime = this.currentTime - this.startTime; 
		this.startTime = this.currentTime
		this.lag += elapsedTime
		
		while(this.lag >= this.frameDuration) {
			self.update(elapsedTime, self.screenContext, self.timerContext);
			this.lag -= this.frameDuration;
		}
		
		this.gameTime += elapsedTime/1000;
		
		var lagOffset = this.lag / this.frameDuration;
		self.render(lagOffset);
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}

var game = new Game('gameScreen', 'timer');
console.log(game);
game.start();