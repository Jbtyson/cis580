
// Enemy class
//----------------------------------
var Enemy = function(game, x, y, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.x0 = x;	// orig x
    this.y0 = y;	// orig y
    this.type = type;	// type of enemy
    
	// Movement variables
	this.state = "wait"; // wait means that it is off the screen
    this.movementTimer = 0;	// time since the last move
		if(this.type == "jet")
		this.speed = 0.2;
    else
	    this.speed = 0.05;
		
	this.deviation = 200;	// max deviation in the x direction from original position
	
	// Firing variables
	this.maxMissileTimer = 5000;	// timer for when a missle be fired, ex. 5000 = at least one missile per 5 seconds
	this.minMissileDelay = 2500;	// minimum time between missiles
	this.chanceToFire = 0.5; // % per frame
	this.missileTimer = this.maxMissileTimer;
	this.missileDelay = 0;
};

Enemy.prototype = {
	
	update: function(elapsedTime) {
		// get position relative to the screen
		this.screenX = this.x - (this.game.heli.x - this.game.cameraOffset)
		
		// chance to fire a missile
		if(this.state != "wait") {
			this.missileTimer -= elapsedTime;	// if this timer reaches 0 fire a missle
			this.missileDelay += elapsedTime;	// time since last missile fired
			
			// fire a missile if min delay has passed
			if(this.missileDelay >= this.minMissileDelay) {
				//fire a missle if the max timer reaches 0
				if(this.missileTimer <= 0)
					this.fireMissile();		
				// fire a missile based on chance
				else if(Math.random()*100 > 100 - this.chanceToFire)
					this.fireMissile();
			}
		}
	
		// gun encampments
		if(this.type == "gun") {
			switch(this.state) {
				// check if the enemy is on screen
				case "wait":
					if(this.screenX < 900 && this.screenX > -100)
						this.state = "active";
					break;
					
				// check if the enemy is off the screen
				case "active":
					if(this.screenX > 900 || this.screenX < -100)
						this.state = "wait";
					break;
			}
		}
		
		// jets
		else if(this.type == "jet") {
			switch(this.state) {
				// check if its on the screen
				case "wait":
					if(this.screenX < 900)
						this.state = "active";
					break;
					
				// simply flying left
				case "active":
					this.x -= this.speed * elapsedTime;
					if(this.screenX < -100)
						this.state = "dead";
					break;
			}	
		}
		
		// tanks
		else {
			switch(this.state) {
				// off screen
				case "wait":
					if(this.screenX < 900 && this.screenX > -100)
						this.state = "active";
					break;
					
				// waiting for a command
				case "active":
					this.movementTimer -= elapsedTime;
					// check if the last move has finished executing
					if(this.movementTimer <= 0) {
						var r = Math.floor(Math.random() * 100);
						if(r < 35)
							this.state = "movingLeft";
						else if (r < 70)
							this.state = "movingRight";
						else 
							this.state = "rest";
						// set the time for the move to execute
						this.movementTimer = Math.floor(Math.random() * 2500);
					}
					break;
				
				// rest in place for set time, still on screen and can fire
				case "rest":
					this.movementTimer -= elapsedTime;
					if(this.movementTimer <= 0) {
						this.state = "active";
					}
				
				// moving left until timer reaches 0
				case "movingLeft":
					this.movementTimer -= elapsedTime;
					if(this.movementTimer <= 0)
						this.state = "active";
					else if(this.x0 - this.x > this.deviation)
						this.state = "movingRight";
					else
						this.x -= this.speed * elapsedTime;
					break;
					
				// moving right until timer reaches 0
				case "movingRight":
					this.movementTimer -= elapsedTime;
					if(this.movementTimer <= 0)
						this.state = "active";
					else if(this.x - this.x0 > this.deviation)
						this.state = "movingLeft";
					else
						this.x += this.speed * elapsedTime;
					break;
			}
		}
	},
	
	render: function(context) {
		// gun encampments
		if(this.type == "gun") {
			context.fillRect(this.x, this.y, 30, 30);
		}
		
		// jets
		else if(this.type == "jet") {
			context.fillRect(this.x, this.y, 50, 10);
		}
		
		// tanks
		else {
			// angle gun
			var a = this.getAngle() + PI;
			context.save();
			context.translate(this.x+28, this.y+28)
			context.rotate(a);
			context.drawImage(Resource.Image.tankSpriteSheet, 0, 56, 46, 4, 0, 0, 46, 4);
			context.restore();
			
			//draw the tank
			context.save();
			context.drawImage(Resource.Image.tankSpriteSheet, 0, 0, 100, 53, this.x, this.y, 100, 53);
			context.restore
		}
		
	},
	
	fireMissile: function() {
		var missile = new Missile(
			this.game, 
			this.game.heli.sprite_sheet, 
			this.x, 
			this.y, 
			this.game.heli.x, 
			this.game.heli.y
		);
		this.game.missiles.push(missile);
		Resource.Audio.missile.pause();
		Resource.Audio.missile.currentTime = 0;
		Resource.Audio.missile.play();
		
		this.missileTimer = this.maxMissileTimer;
		this.missileDelay = 0;
	},
	
	getAngle: function() {
		// gets the angle and corrects it because atan returns -pi/2 -> pi/2
		angle = Math.atan((this.game.heli.y - this.y) / (this.game.heli.x - this.x));
		if(this.ty - this.y < 0) {
			angle += 2 * PI;
		}
		if(this.tx - this.x < 0) {
			angle += PI;
		}
		while(angle > 2 * PI) {
			angle -= 2 * PI;
		}
		while(angle < 0) {
			angle += 2 * PI;
		}
		return angle;
	},
};