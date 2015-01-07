// Target.js
var PI = Math.PI;

var Target = function(x, y, scrolling, game) {
	this.x = x;
	this.y = y;
	this.game = game;
	this.uy = y-50;
	this.by = y+50;
	this.scrolling = scrolling;
	this.speed = 0.05;
	this.direction = 1;
	this.radius = 20;
	this.onScreen = false;
	this.explosion = null;
}

Target.prototype = {
	update: function(elapsedTime) {
		// decide to go up or down
		if(this.y <= this.uy) {
			this.direction = 1;
		}
		else if(this.y >= this.by) {
			this.direction = -1;
		}
		
		this.y += this.speed * this.direction * elapsedTime;
		
		// compensate for world scrolling
		if(this.scrolling.right == true) {
			this.x -= 5;
		}
		else if(this.scrolling.left == true) {
			this.x += 5;
		}
		
		// calcualte if its on the screen
		if(this.x >= 0 && this.x <= 800 && this.y >= 0 && this.y <= 480) {
			this.onScreen = true;
		}
		
		//update explosion if needed
		if(this.explosion != null) {
			this.explosion.update(elapsedTime);
		}
	},
	
	render: function(context) {
		// check if its on the screen
		if(this.onScreen == true) {
			// check if it exploded
			if(this.explosion != null) {
				this.explosion.render(context);
			}
			// draw purple circle
			else {
				context.save();
				context.strokeStyle = "#000000";
				context.fillStyle = "#512888";
				context.beginPath();
				context.arc(this.x, this.y, this.radius, 0, 2*PI, false);
				context.fill();
				context.stroke();
				context.restore();
			}
		}
	},
	
	destroy: function() {
		this.explosion = new Explosion(this.x, this.y - 50, this.scrolling, this);
		this.game.score += 100;
	}
}