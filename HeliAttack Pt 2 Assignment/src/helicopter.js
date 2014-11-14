
// Helicopter class
//----------------------------------
var Helicopter = function(game, x, y) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.velocity = 5;
	this.health = 100;
	this.pitch_angle = 0;
	this.turret_angle = 0;
	this.missiles = 3;
	this.sprite_sheet = Resource.Image.spritesheet;
	this.bulletDelay = 0
	this.life = 3;
};

Helicopter.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render helicopter with pitch angle, missiles, and targeted turret
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.pitch_angle);
		context.translate(-65, -4);
		context.save();
		context.translate(90, 35);
		context.rotate(this.turret_angle);
		context.drawImage(this.sprite_sheet, 100, 56, 25, 8, -5, 0, 25, 8);
		context.restore();
		context.drawImage(this.sprite_sheet, 0, 0, 131, 52, 0, 0, 131, 52);
		context.translate(56, 35);
		for(i = 0; i < this.missiles; i++) {
			context.translate(2,2);
		  context.drawImage(this.sprite_sheet, 75, 56, 17, 8, 0, 0, 17, 8);
		}
		context.restore();
	},
	
	update: function(elapsedTime, inputState) {
	
		// Move the helicopter
		this.move(inputState);	
		
		// Aim the turrent
		this.aim(inputState);
	},
	
	fireBullet: function(x, y) {
		var bullet = new Bullet(
			this.game,
			this.x + 42*Math.cos(1.0+this.pitch_angle) + 20*Math.cos(this.turret_angle),
			this.y + 42*Math.sin(1.0+this.pitch_angle) + 20*Math.sin(this.turret_angle),
			8*Math.cos(this.turret_angle), 
			8*Math.sin(this.turret_angle)
		);
		this.game.bullets.push(bullet);
	},
	
	fireMissile: function(x, y) {
		if(this.missiles > 0) {
			var missile = new Missile(
				this.game, 
				this.sprite_sheet, 
				this.x, 
				this.y+35, 
				x, 
				y
			);
			this.game.missiles.push(missile);
			this.missiles -= 1;
			Resource.Audio.missile.pause();
			Resource.Audio.missile.currentTime = 0;
			Resource.Audio.missile.play();
		}
	},
	
	powerupReceived: function(type) {
		if(type == "missile") {
			this.missiles += 3;
		}
		else if(type == "health") {
			this.health += 25;
		}
		else if(type == "life") {
			this.life++;
		}
		else {
			this.health -= 10;
		}
	},
	
	move: function(inputState) {
		if(inputState.up) {
			this.y -= this.velocity * 2;
		} else if(inputState.down) {
			this.y += this.velocity * 5;
		}
		if(inputState.left) {
			this.pitch_angle = -Math.PI/10;
			this.x -= this.velocity * 2;
		} else if(inputState.right) {
			this.pitch_angle = Math.PI/8;
		  this.x += this.velocity * 5;
		} else {
			this.pitch_angle = 0;
		}
	},
	
	aim: function(inputState) {
		var x, y, angle;
		x = inputState.worldX - this.x + 10;
		y = inputState.worldY - this.y + 35;
		angle = Math.atan2(y, x);
		this.turret_angle = Math.min(Math.PI/2, Math.max(-Math.PI/8, angle));
	},
	
	bounds: function() {
		return {
			top: this.x - 64,
			left: this.y,
			bottom: this.y + 50,
			right: this.x + 67
		};
	}
};