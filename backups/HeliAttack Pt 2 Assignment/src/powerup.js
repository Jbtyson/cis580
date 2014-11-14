
// Powerup class
//----------------------------------
var Powerup = function(game, x, y, type) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.state = "alive";
	this.timeRemaining = 10000;
	if(type != "random") {
		this.type = type;
	}
	else {
		var r = Math.floor(Math.random() * 100);
		if(r < 50) {
			this.type = "missile";
			this.color = "red";
		}	
		else if (r < 80) {
			this.type = "health";
			this.color = "green";
		}	
		else if (r < 90) {
			this.type = "life";
			this.color = "blue";
		}	
		else {
			this.type = "damage";
			this.color = "black";
		}	
	}
};

Powerup.prototype = {
	update: function(elapsedTime) {
		this.timeRemaining -= elapsedTime;
		
		if(this.timeRemaining <= 0)
			this.state = "dead";
	},
	
	render: function(context) {
		context.beginPath();
		context.fillStyle = this.color;
		context.arc(this.x, this.y, 10, 0, 2*Math.PI);
		context.fill();
	},
}