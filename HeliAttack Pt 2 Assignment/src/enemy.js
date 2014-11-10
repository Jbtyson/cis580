
// Enemy class
//----------------------------------
var Enemy = function(game, x, y, type) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.x0 = x;
  this.y0 = y;
  this.type = type;
  this.state = "wait";
  this.timer = 0;
  this.speed = 1;
};

Enemy.prototype = {
	
	update: function(elapsedTime) {
		switch(state) {
			// off screen
			case "wait":
				if(this.x < 900 && this.x > -100)
					this.state = "active";
				break;
			// waiting for a command
			case "active":
				this.timer -= elapsedTime;
				if(this.timer <= 0) {
					var r = Math.Floor(Math.random() * 100);
					if(r < 40)
						this.state = "movingLeft";
					else if r < 80
						this.state = "movingLeft";
					else 
						this.state = "rest";
					this.timer = Math.Floor(Math.random() * 2500);
				}
				break;
			// moving left until timer reaches 0
			case: "movingLeft":
				this.timer -= elapsedTime;
				if(this.timer <= 0)
					this.state = "active";
				else
					this.x -= this.speed * elapsedTime;
				break;
			// moving right until timer reaches 0
			case: "movingRight":
				this.timer -= elapsedTime;
				if(this.timer <= 0)
					this.state = "active";
				else
					this.x += this.speed * elapsedTime;
				break;
		}
	}
}
	
	render: function(context) {
		
	},
};