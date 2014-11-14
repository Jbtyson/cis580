
// Bullet class
//----------------------------------
var Bullet = function(game, bx, by, vx, vy) {
  this.game = game;
  this.x = bx;
  this.y = by;
  this.velocityX = vx;
  this.velocityY = vy;
  this.state = "active";
};

Bullet.prototype = {
	x: 0,
	y: 0,
	radius: 1,
	
	render: function(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		context.fill();
	},
	
	update: function(elapsedTime) {
		this.x += this.velocityX;
		this.y += this.velocityY;
		this.screenX = this.x - (this.game.heli.x - this.game.cameraOffset)
		
		if(this.y <= 0 || this.y >= HEIGHT)
			this.state = "dead";
		else if(this.screenX > WIDTH || this.screenX < 0) 
			this.state = "dead";
	},
	
	bounds: function() {
		return {
			top: this.y - this.radius,
			left: this.x + this.radius, 
			right: this.x - this.radius, 
			bottom: this.y + this.radius
		}
	}
};