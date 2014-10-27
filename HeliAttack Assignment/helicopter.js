
// Helicopter class
//----------------------------------
var Helicopter = function(game, x, y, grid) {
	this.game = game;
	this.id = 0;
	
	// position variables
	this.x = x;
	this.y = y;
	this.speed = 1;
	
	// data variables
	this.grid = grid;
	this.bullets = [];
	this.missiles =[];
	
	// gui info variable
	this.health = 100;
	this.lives = 3;
	this.numMissiles = 5;
	this.bulletElapsedTime = 500;
	
	// rendering variables
	this.pitch_angle = 0;
	this.turret_angle = 0;
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "images/helicopter.png";	
	this.mouse = { x: this.x+50, y: this.y };
	this.scrolling = game.scrolling;
	
};

Helicopter.prototype = {
	
	render: function(context) {
		// Render helicopter with pitch angle, missiles, and targeted turret
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.pitch_angle);
		context.translate(-65, -4);
		
		// render turret
		context.save();
		context.translate(90, 35);
		context.rotate(this.turret_angle);
		context.drawImage(this.sprite_sheet, 100, 56, 25, 8, -5, 0, 25, 8);
		context.restore();
		
		// render heli
		context.drawImage(this.sprite_sheet, 0, 0, 131, 52, 0, 0, 131, 52);
		context.translate(56, 35);
		
		// not sure what this does, i think its supposed to draw missiles on the heli, need to fix later
		for(i = 0; i < this.missiles; i++) {
			context.translate(2,2);
		    context.drawImage(this.sprite_sheet, 75, 56, 17, 8, 0, 0, 17, 8);
		}
		context.restore();
		
		// render bullets fired
		this.bullets.forEach(function(bullet) {
			bullet.render(context);
		});
		
		// render missiles fired
		this.missiles.forEach(function(missile) {
			missile.render(context);
		});
	},
	
	update: function(elapsedTime, inputState) {
		self = this;
		
		// move the helicopter
		this.move(inputState);

		// rotate the turret
		this.turret_angle = Math.atan((this.mouse.y - this.y) / (this.mouse.x - this.x));
		if(this.mouse.y - this.y < 0) {
			this.turret_angle += 2 * PI;
		}
		if(this.mouse.x - this.x < 0) {
			this.turret_angle += PI;
		}
		
		// attempt to fire another bullet
		this.bulletElapsedTime += elapsedTime;
		if(this.fireBullets == true && this.bulletElapsedTime >= 100) {
			b = new Bullet(this.x, this.y, this.mouse.x, this.mouse.y, this.scrolling, this.id++);
			this.bullets.push(b);
			this.grid.add(b);
			this.bulletElapsedTime = 0;
		}
		
		// update/remove bullets
		this.bullets.forEach(function(bullet) {
			bullet.update(elapsedTime);
			if(bullet.destroyed == true) {
				self.grid.remove(bullet);
				index = self.bullets.indexOf(bullet);
				self.bullets.splice(index, 1);
			}
		});

		// update/remove missiles
		this.missiles.forEach(function(missile) {
			missile.update(elapsedTime, this.scrolling);
			if(missile.destroyed == true) {
				self.grid.remove(missile);
				index = self.missiles.indexOf(missile);
				self.missiles.splice(index, 1);
			}
		});
		
	},
	
	move: function(inputState) {
		// reset scrolling variables to prevent getting stuck
		this.scrolling.left = false;
		this.scrolling.right = false;
		
		// check for vertical movement
		if(inputState.up) {
			if(this.y > 50) {
				this.y -= this.speed * 5;
			}
		} else if(inputState.down) {
			if(this.y < 350) {
				this.y += this.speed * 5;
			}
		}
		// check for lateral movement
		if(inputState.left) {
			this.pitch_angle = -Math.PI/10;	// angle the helicopter
			// rubber band heli
			if(this.x > 100) {
				this.x -= this.speed * 5;
			}
			else {
				this.game.sx -= this.speed * 5;	// scroll the background right
				this.scrolling.left = true;	// tell the missiles and bullets to adjust for the scrolling
			}
		} else if(inputState.right) {
			this.pitch_angle = Math.PI/8;	// angle the helicopter
			// rubber band heli
		    if(this.x < 400) {
				this.x += this.speed * 5;
			}
			else {
				this.game.sx += this.speed * 5;	// scroll the background left
				this.scrolling.right = true;	// tell the missiles and bullets to adjust for the scrolling
			}
		} else {
			this.pitch_angle = 0;	// reset pitch angle
		}
	},
	
	handleClick: function(e, mouse) {
		this.mouse = mouse;
		// fire bullets till release
		if(e.which == 1) {
			this.fireBullets = true;
		}
		// log stuff for debugging
		if(e.which == 2) {
			console.log(this.bullets);
			console.log(this.missiles);
			console.log(this.grid);
		}
		// fire one missile
		else if(e.which == 3) {
			if(this.numMissiles > 0) {
				this.missiles.push(new Missile(this.x, this.y, mouse.x, mouse.y, this.scrolling, this.id++));
				this.numMissiles--;
			}
		}
	},
	
	// stop firing bullets on mouse left up
	handleMouseUp: function(e) {
		if(e.which == 1) {
			this.fireBullets = false;
		}
	}
};