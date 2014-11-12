
// Enemy class
//----------------------------------
var Enemy = function(game, x, y, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.x0 = x;
    this.y0 = y;
    this.type = type;
    this.state = "wait"; // wait means that it is off the screen
    this.timer = 0;
	this.delay = 1000;
	this.missileTimer = 10000;
	this.missileDelay = 0;

	if(this.type == "jet")
		this.speed = 0.2;
    else
	    this.speed = 0.05;
		
	this.deviation = 200;
};

Enemy.prototype = {
	
	update: function(elapsedTime) {
		this.screenX = this.x - (this.game.heli.x - this.game.cameraOffset)
		
		// chance to fire a missile
		if(this.state != "wait") {
			this.missileTimer -= elapsedTime;	// if this reaches 0 fire a missle
			this.missileDelay += elapsedTime;	// time since last missile fired
			
			if(this.missileDelay >= this.delay) {
				var r = Math.floor(Math.random() * 100);
				if(this.missileTimer <= 0)
					this.fireMissile();
				else if(r > 95)
					this.fireMissile();
			}
		}
	
		// gun encampments
		if(this.type == "gun") {
			switch(this.state) {
				case "wait":
					if(this.screenX < 900 && this.screenX > -100)
						this.state = "active";
					break;
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
					this.timer -= elapsedTime;
					if(this.timer <= 0) {
						var r = Math.floor(Math.random() * 100);
						if(r < 35)
							this.state = "movingLeft";
						else if (r < 70)
							this.state = "movingRight";
						else 
							this.state = "rest";
						this.timer = Math.floor(Math.random() * 2500);
					}
					break;
				
				case "rest":
					this.timer -= elapsedTime;
					if(this.timer <= 0) {
						this.state = "active";
					}
				
				// moving left until timer reaches 0
				case "movingLeft":
					this.timer -= elapsedTime;
					if(this.timer <= 0)
						this.state = "active";
					else if(this.x0 - this.x > this.deviation)
						this.state = "movingRight";
					else
						this.x -= this.speed * elapsedTime;
					break;
					
				// moving right until timer reaches 0
				case "movingRight":
					this.timer -= elapsedTime;
					if(this.timer <= 0)
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
		else if(this.type == "jets") {
			context.fillRect(this.x, this.y, 50, 10);
		}
		
		// tanks
		else {
			context.fillRect(this.x, this.y, 50, 20);
		}
		
	},
	
	fireMissile: function() {
		var missile = new Missile(
			this.game, 
			this.game.heli.sprite_sheet, 
			this.x, 
			this.y+35, 
			this.game.heli.x, 
			this.game.heli.y
		);
		this.game.missiles.push(missile);
		Resource.Audio.missile.pause();
		Resource.Audio.missile.currentTime = 0;
		Resource.Audio.missile.play();
	},
};