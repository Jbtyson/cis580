
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

	if(this.type == "jet")
		this.speed = 0.2;
    else
	    this.speed = 0.1;
	this.deviation = 200;
};

Enemy.prototype = {
	
	update: function(elapsedTime) {
		// gun encampments
		if(this.type == "gun") {
			switch(this.state) {
				case "wait":
					if(this.x < 900 && this.x > -100)
						this.state = "active";
					break;
				case "active":
					// shoot at the heli
			}
		}
		
		// jets
		else if(this.type == "jet") {
			switch(this.state) {
				// check if its on the screen
				case "wait":
					if(this.x < 900 && this.x > -100)
						this.state = "active";
					else if(this.x < -100)
						this.state = "dead";
					break;
					
				// simply flying left
				case "active":
					this.x -= this.speed *= elapsedTime;
					break;
			}	
		}
		
		// tanks
		else {
			switch(this.state) {
				// off screen
				case "wait":
					if(this.x < 900 && this.x > -100)
						this.state = "active";
					break;
					
				// waiting for a command
				case "active":
					this.timer -= elapsedTime;
					if(this.timer <= 0) {
						var r = Math.floor(Math.random() * 100);
						if(r < 35)
							this.state = "movingLeft";
						else if (r < 35)
							this.state = "movingRight";
						else 
							this.state = "rest";
						this.timer = Math.floor(Math.random() * 1500);
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
};