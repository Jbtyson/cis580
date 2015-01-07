// Screen Size
var WIDTH = 800;
var HEIGHT = 480;
var SIDE = 5;
var granularity = { "h" : WIDTH/SIDE, "v" : HEIGHT/SIDE };
var gameOver = false;

var MathHelper = {
	clamp: function(value, min, max){
		if(value <= min) return min;
		if(value >= max) return max;
		return value;
	},
	
	fixAtan: function(angle) {
		if(angle < 0) {
			angle += 2 * Math.PI;
		}
		return angle;
	}
};

// RESOURCES
// ----------------------------------
var Resource = { img: {}, sfx: {}}

Resource.img.background = new Image();
Resource.img.background.src = "outer_space.jpg";
Resource.img.ship = new Image();
Resource.img.ship.onload
Resource.img.ship.src = "ship.png";
Resource.sfx.collide = new Audio();
Resource.sfx.collide.src = "collide.wav";

var Ship = function() {
	this.xmid = WIDTH / 2;
	this.ymid = HEIGHT / 2;
	this.tip = {"x": this.xmid, "y": this.ymid - 15}
	this.lcorner = {"x": this.xmid - 10, "y": this.ymid + 10}
	this.rcorner = {"x": this.xmid + 10, "y": this.ymid + 10}
	this.rotateRight = false;
	this.rotateLeft = false;
	this.rotateSpeed = .1;
	this.angle = 0;
	this.missiles = [];
}

Ship.prototype = {
	
	// shoots a missle
	shootMissle: function(e) {
		m = new Missile(this.angle);
		this.missiles.push(m);
	},
	
	// updates the coords of the triangle
	update: function(elapsedTime) {
		if(this.rotateRight) {
			this.tip = this.rotateCoord(this.tip);
			this.rcorner = this.rotateCoord(this.rcorner);
			this.lcorner = this.rotateCoord(this.lcorner);
		}
		else if(this.rotateLeft) {
			this.tip = this.rotateCoord(this.tip);
			this.rcorner = this.rotateCoord(this.rcorner);
			this.lcorner = this.rotateCoord(this.lcorner);
		}
		this.angle = MathHelper.fixAtan(Math.atan((this.tip.y - this.ymid) / (this.tip.x - this.xmid)))
		console.log(this.angle);
	},
	
	// rotates the triangle to new coords
	rotateCoord: function(coord) {
		newCoord = {"x": 0, "y": 0}
		if(this.rotateRight) {
			speed = this.rotateSpeed;
		}
		else if(this.rotateLeft) {
			speed = this.rotateSpeed * -1;
		}
		x = coord.x - this.xmid;
		y = coord.y - this.ymid;
		newCoord.x = this.xmid + (x * Math.cos(speed) - y * Math.sin(speed));
		newCoord.y = this.ymid + (x * Math.sin(speed) + y * Math.cos(speed));
		return newCoord;
	},
	
	// renders the ship
	render: function(context) {		
		context.save();
		context.strokeStyle = "#000000";
		context.fillStyle = "#ffffff";
		context.moveTo(this.tip.x,this.tip.y);
		context.lineTo(this.lcorner.x,this.lcorner.y);
		context.lineTo(this.rcorner.x,this.rcorner.y);
		context.rotate(1);
		context.fill();
		context.stroke();
		context.restore();
		
		context.restore();
	},
}

var Missile = function(angle) {
	this.x = WIDTH / 2;
	this.y = HEIGHT / 2;
	this.width = 3;
	this.height = 10;
	this.velocity = 1;
	this.angle = angle;
	this.destroyed = false;
}

Missile.prototype = {
	update: function(elapsedTime) {
		if(!this.destroyed) {
			this.x += elapsedTime * this.velocity * Math.cos(this.angle);
			this.y += elapsedTime * this.velocity * Math.sin(this.angle);
			
			// destroy missiles off screen
			if(this.x < - this.height) this.destroyed = true;
			if(this.x > WIDTH + this.height) this.destroyed = true;
			if(this.y < - this.height) this.destroyed = true;
			if(this.y > HEIGHT + this.height) this.destroyed = true;
			
			//move them away
			if(this.destroyed) {
				this.x = -100;
				this.y = -100;
			}
		}
	},
	
	render: function(context) {
		context.save();
		context.fillStyle = "#ffffff";
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();
	}
}

// ASTEROID
//---------------------------
var Asteroid = function(id, velocity, angle, mass) {
	this.id = id;
	if(velocity != undefined) this.velocity = velocity;
	if(angle != undefined) this.angle = angle;
	if(mass != undefined) {
		this.mass = mass;
		this.radius = mass;
	}
	this.radius = mass;
	this.x = Math.random() * WIDTH;
	this.y = Math.random() * HEIGHT;
	this.prev = null;
	this.next = null;
};

Asteroid.prototype = {
	x: 0,
	y: 0,
	radius: 10,
	velocity: 10,
	angle: 0,
	cell: -1,
	
	render: function(context) {
		context.save();
		context.strokeStyle = "#000000";
		context.fillStyle = "#aaaaaa";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		context.fill();
		context.stroke();
		context.restore();
	},
	
	update: function(elapsedTime) {
		this.x += elapsedTime * this.velocity * Math.cos(this.angle);
		this.y += elapsedTime * this.velocity * Math.sin(this.angle);
		
		// Wrap asteroid when going off-screen
		if(this.x < - this.radius) this.x += WIDTH + this.radius;
		if(this.x > WIDTH + this.radius) this.x -= WIDTH + this.radius;
		if(this.y < - this.radius) this.y += HEIGHT + this.radius;
		if(this.y > HEIGHT + this.radius) this.y -= HEIGHT + this.radius;
		
		// TODO: Rotate the asteroid
	}
};

var Grid = function(granularity) {
	this.cellWidth = granularity.h;
	this.cellHeight = granularity.v;
	this.length = SIDE*SIDE;
	this.cells = [length];
	for(i = 0; i < this.length; i++) {
		this.cells[i] = null;
	}
};

Grid.prototype = {
	// adds an asteroid to its respective cell based on position
	add: function(asteroid) {
		// verify inputs
		x = (asteroid.x > WIDTH) ? WIDTH : asteroid.x;
		x = (asteroid.x > 0) ? 0 : asteroid.x;
		y = (asteroid.y > HEIGHT) ? HEIGHT : asteroid.y;
		y = (asteroid.y > 0) ? 0 : asteroid.y;
		
		asteroid.cell = Math.floor(x/granularity.h) + (Math.floor(y/granularity.v) * SIDE);
		if(asteroid.cell > 25) debugger;
		// add it to the front of the linked list
		asteroid.prev = null;
		asteroid.next = this.cells[asteroid.cell]
		this.cells[asteroid.cell] = asteroid;
		if(asteroid.next != null && typeof(asteroid.next) != "undefined") {
			asteroid.next.prev = asteroid;
		}
	},
	
	// removes an asteroid from its cell
	remove: function(asteroid) {
		temp = this.cells[asteroid.cell];
		
		// find the asteroid
		while(temp != null && typeof(temp) != "undefined") {
			// remove if found
			if(temp == asteroid) {
				if(temp.prev != null) {
					temp.prev.next = temp.next;
				}
				if(temp.next != null) {
					temp.next.prev = temp.prev;
				}
				if(asteroid.next == null && asteroid.prev == null) {
					this.cells[asteroid.cell] = null;
				}
				break;
			}
			temp = temp.next;
		}
	},
	
	// moves an asteroid from one cell to another
	move: function(asteroid) {
		if (asteroid.cell != Math.floor(asteroid.x/granularity.h) + (Math.floor(asteroid.y/granularity.v) * SIDE)) {
			this.remove(asteroid);
			this.add(asteroid);
		}
	},
	
	// checks for a collision between asteroids
	handleAsteroid: function(asteroid, other) {
		
		// iterate through all of the asteroids
		while(other != null && typeof(other) != "undefined") {
			dif = Math.sqrt(Math.pow(asteroid.x - other.x, 2) + Math.pow(asteroid.y - other.y, 2))
			distance = asteroid.radius + other.radius;
			
			if(dif <= distance) {
				this.handleCollision(asteroid, other)
			}
			other = other.next;
		}
	},
	
	// checks all asteroids within a cell
	handleCell: function(cell) {
		temp = this.cells[cell];
		
		// iterate through all of the asteroids
		while(temp != null && typeof(temp) != "undefined") {
			this.handleAsteroid(temp, temp.next);

			// check neighbouring cells
			x = cell % SIDE;
			y = (cell - x) / SIDE;
			
			// top left
			if (x > 0 && y > 0) {
				this.handleAsteroid(temp, cell[SIDE * (y - 1) + (x - 1)]);
			}
			// left
			if (x > 0) {
				this.handleAsteroid(temp, cell[SIDE * y + (x - 1)]);
			}
			//top
			if (y > 0) {
				this.handleAsteroid(temp, cell[SIDE * (y - 1) + x]);
			}
			//bottom left
			if (x > 0 && y < this.cellHeight - 1) {
				this.handleAsteroid(temp, cell[SIDE * (y + 1) + (x - 1)]);
			}

			temp = temp.next;
		}
		
		// check for collision with ship
		if(cell == ((this.cells.length - 1) / 2)) {
			temp = this.cells[cell];
			while(temp != null && typeof(temp) != "undefined") {
				if(((temp.x + temp.radius - WIDTH/2) < 10 || (temp.x - temp.radius - WIDTH/2) < 10) && ((temp.x + temp.radius - WIDTH/2) > 0 || (temp.x - temp.radius - WIDTH/2) > 0)) {
					if(((temp.y + temp.radius - WIDTH/2) < 10 || (temp.y - temp.radius - HEIGHT/2) < 10) && ((temp.y + temp.radius - WIDTH/2) > 0 || (temp.y - temp.radius - HEIGHT/2) > 0)) {
						gameOver = true;
					}
				}
			}
		}
	},
	
	// handles a collision between two asteroids
	handleCollision: function(asteroid, other) {
		// only allow one calculation
		if (asteroid.lastCollision == other.id && other.lastCollision == asteroid.id) return;
		console.log("colliding " + asteroid.id + " and " + other.id);
		asteroid.lastCollision = other.id;
		other.lastCollision = asteroid.id;
		
		//Resource.sfx.collide.play();
		
		//get basics
		m1 = asteroid.mass;
		m2 = other.mass;		
		a = MathHelper.fixAtan(Math.atan((other.y - asteroid.y)/(other.x - asteroid.x)));

		//get components
		v1x = asteroid.velocity * Math.cos(asteroid.angle - a);
		v1y = asteroid.velocity * Math.sin(asteroid.angle - a);
		v2x = other.velocity * Math.cos(other.angle - a);
		v2y = other.velocity * Math.sin(other.angle - a);
		
		// rotate system
		f1xr = (v1x * (m1 - m2) + 2 * m2 * other.velocity) / (m1 + m2) ;
		f2xr = (v2x * (m1 - m2) + 2 * m2 * asteroid.velocity) / (m1 + m2);
		f1yr = v1y;
		f2yr = v2y;

		// get finals
		f1x = Math.cos(a)*f1xr+Math.cos(a+Math.PI/2)*f1yr;
		f1y = Math.sin(a)*f1xr+Math.sin(a+Math.PI/2)*f1yr;
		f2x = Math.cos(a)*f2xr+Math.cos(a+Math.PI/2)*f2yr;
		f2y = Math.sin(a)*f2xr+Math.sin(a+Math.PI/2)*f2yr;
		
		// get magnitudes
		asteroid.velocity = Math.sqrt(f1x * f1x + f1y * f1y);
		other.velocity = Math.sqrt(f2x * f2x + f2y * f2y);
		
		//get directions
		asteroid.angle = MathHelper.fixAtan(Math.atan(v1y/f1x) + a);
		while(asteroid.angle > 2 * Math.PI) {
			asteroid.angle -= 2 * Math.PI;
		}
		other.angle = MathHelper.fixAtan(Math.atan(v2y/f2x) + a);
		while(other.angle > 2 * Math.PI) {
			other.angle -= 2 * Math.PI;
		}
	},

}

var Vector = function(magnitude, x, y) {
	this.x = x;
	this.y = y;
	this.update();
}

Vector.prototype = {
	
	add: function(vOther) {
		newX = this.x + vOther.x;
		newY = this.y + vOther.y;
		return new Vector(newX, newY);
	},
	
	update: function() {
		this.magnitude =  Math.sqrt(this.x * this.x + this.y * this.y);
		this.angle = Math.atan(this.y/this.x);
	}
}

var Asteroids = function (canvasId) {
	var myself = this;
  
	// Rendering variables
	this.frontBuffer = document.getElementById(canvasId);
	this.frontBufferContext = this.frontBuffer.getContext('2d');	
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.frontBuffer.width;
	this.backBuffer.height = this.frontBuffer.height;
	this.backBufferContext = this.backBuffer.getContext('2d');

	// Game variables
	this.asteroids = [];
	this.level = 1;
	this.gameOver = false;
	this.grid = new Grid(granularity);

	// Timing variables
	this.startTime = 0;
	this.lastTime = 0;
	this.gameTime = 0;
	this.fps = 0;
	this.STARTING_FPS = 60;

	// Pausing variables
	this.paused = false;
	this.startedPauseAt = 0;
	this.PAUSE_TIMEOUT = 100;

	window.addEventListener("blur", function( event) {
	myself.paused = true;
	});
}
	
Asteroids.prototype = {

	update: function(elapsedTime) {
		// update ship
		this.ship.update(elapsedTime);
		
		// update missiles
		this.ship.missiles.forEach(function(missile) {
			if(!missile.destroyed) {
				missile.update(elapsedTime);
			}
			else {
				missile = null;
			}
		});
		
		// Update asteroids
		this.asteroids.forEach( function(asteroid) {
			asteroid.update(elapsedTime);
		});
		
		// TODO: handle asteroid collisions
		for(i = 0; i < this.asteroids.length; i++) {
			this.grid.move(this.asteroids[i]);
		}
		for(i = 0; i < this.grid.length; i++) {
			this.grid.handleCell(i);
		}
	},
	
	render: function(elapsedTime) {
		var self = this;
		
	  // Clear screen
		this.backBufferContext.fillStyle = "#000";
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		this.backBufferContext.drawImage(Resource.img.background, 0, 0);
			
		// render ship
		this.ship.render(self.backBufferContext);
		
		// render missiles
		this.ship.missiles.forEach(function(missile) {
			missile.render(self.backBufferContext);
		});
		
		// Render asteroids
		this.asteroids.forEach( function(asteroid) {
			asteroid.render(self.backBufferContext);
		});
		
		// Render GUI
		if(this.gameOver){
			this.renderGuiText("Game Over", 380, 220);
			this.renderGuiText("Press [enter] for new game", 300, 260);
		}
		else if(this.paused) {
			this.renderGuiText("Paused", 380, 220);
			this.renderGuiText("Press [space] to continue", 300, 260);
		}
		if(this.displayLevel) {
			this.renderGuiText("Level " + this.level, 380, 220);
		}
		this.frontBufferContext.drawImage(this.backBuffer, 0, 0);
	},
	
	renderGuiText: function(message, x, y){
		this.backBufferContext.save();
		this.backBufferContext.font = "20px Arial";
		this.backBufferContext.fillStyle = "#ffffff";
		this.backBufferContext.fillText(message, x, y);
		this.backBufferContext.fillText(message, x, y);
		this.backBufferContext.restore();
	},
	
	beginLevel: function() {
	  var self = this;
		// create ship
		this.ship = new Ship();
		
		// Create asteroids
		for(i = 0; i < this.level * 10; i++) {
			v = new Vector();
			v.magnitude = Math.random() * 0.1 * this.level;
			asteroid = new Asteroid(i, Math.random() * 0.1 * this.level, Math.random() * 2 * Math.PI, Math.random() * 10 + 10);
			this.grid.add(asteroid);
			this.asteroids.push(asteroid);
		}
		
		// Display level in GUI temporarily
		this.displayLevel = true;
		setTimeout(function(){self.displayLevel = false;}, 3000);
	},
	
	keyDown: function(e) {
		switch(e.keyCode){
		  case 13: // ENTER
			  if(game.gameOver) {
					this.level = 1;
					this.score = 0;
					this.beginLevel();
					this.gameOver = false;
				}
				break;
			case 32: // SPACE
				this.paused = !this.paused;
				break;
			case 77: // M
				this.ship.shootMissle();
				break;
			case 65: // A
				this.ship.rotateLeft = true;
				break;
			case 68: // D
				this.ship.rotateRight = true;
				break;
		}
	},
	
	keyUp: function(e) {
		switch(e.keyCode) {
			case 65: // A
				this.ship.rotateLeft = false;
				break;
			case 68: // D
				this.ship.rotateRight = false;
				break;
		}
	},
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		
		this.beginLevel();
		this.gameOver = false;
		this.startTime = Date();
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},
	
	loop: function(time) {
		var self = this;
		
		if(this.paused || gameOver) this.lastTime = time;
		var elapsedTime = time - this.lastTime; 
		this.lastTime = time;
		
		self.update(elapsedTime);
		self.render(elapsedTime);
			
		if (this.paused || this.gameOver) {
			 // In PAUSE_TIMEOUT (100) ms, call this method again to see if the game
			 // is still paused. There's no need to check more frequently.
			 
			 setTimeout( function () {
					window.requestNextAnimationFrame(
						 function (time) {
								self.loop.call(self, time);
						 });
			 }, this.PAUSE_TIMEOUT);
             
		}	else {
			
			window.requestNextAnimationFrame(
				function(time){
					self.loop.call(self, time);
				}
			);
		}
	}
}

var game = new Asteroids('myCanvas');
console.log(game);
game.start();