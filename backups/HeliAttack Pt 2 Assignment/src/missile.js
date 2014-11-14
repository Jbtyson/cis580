
// Missile class
//----------------------------------
var Missile = function(game, spriteSheet, mx, my, tx, ty) {
  this.game = game;
  this.x = mx;
  this.y = my;
  this.radius = 10;
  this.targetX = tx;
  this.targetY = ty;
  this.velocity = 8;
  this.spriteSheet = spriteSheet;
  this.state = "flying";
  this.flicker = false;
};

Missile.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		switch(this.state) {
			case "flying":
				context.save();
				context.translate(this.x, this.y);
				context.translate(8, 4);
				context.rotate(this.getAngle());
				context.drawImage(this.spriteSheet, 75, 56, 17, 8, 0, 0, 17, 8);
				if(this.flicker)
					context.drawImage(this.spriteSheet, 38, 55, 10, 10, -9, -1, 10, 10);
				else
					context.drawImage(this.spriteSheet, 38, 55, 10, 10, -9, 0, 10, 10);
				context.restore();
				break;
			case "exploding":
				context.save();
				context.strokeStyle = "yellow";
				context.fillStyle = "white";
				context.lineWidth = 6;
				context.beginPath();
				context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
				context.stroke();
				context.fill();
				context.restore();
				break;
		}
	},
	
	update: function(elapsedTime) {
		
		switch (this.state) {
			case "flying":
				var x = this.targetX - this.x,
					y = this.targetY - this.y,
					d = Math.sqrt(x*x + y*y);
			
				x /= d;
				y /= d;
				
				this.x += this.velocity * x;
				this.y += this.velocity * y;
				
				this.flicker = !this.flicker;
				
				if(d < 5.0) {
					this.state = "exploding";
					Resource.Audio.missile.pause();
					Resource.Audio.missile.currentTime = 0;
					Resource.Audio.explosion.pause();
					Resource.Audio.explosion.currentTime = 0;
					Resource.Audio.explosion.play();
				}
				break;
				
			case "exploding":
			
				this.radius += 2;
				if(this.radius > 25) this.state = "dead";
		}
	
	},
	
	getAngle: function() {
		// gets the angle and corrects it because atan returns -pi/2 -> pi/2
		angle = Math.atan((this.targetY - this.y) / (this.targetX - this.x));
		if(this.targetY - this.y < 0) {
			angle += 2 * PI;
		}
		if(this.targetX - this.x < 0) {
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
	
	bounds: function() {
	context.drawImage(this.spriteSheet, 75, 56, 17, 8, 0, 0, 17, 8);
				
		switch (this.state) {
			case "flying":
				return {
					top: this.y,
					left: this.x, 
					right: this.x + 17, 
					bottom: this.y + 8
				}
			case "exploding":
				return {
					top: this.y - this.radius,
					left: this.x + this.radius, 
					right: this.x - this.radius, 
					bottom: this.y + this.radius
				}
			default:
				return {
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				}
		}
	}
};