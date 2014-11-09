// Explosion.js

var Explosion = function(x, y, scrolling, parent) {
	this.x = x - 20;
	this.y = y + 20;
	this.scrolling = scrolling;
	this.parent = parent;
	this.img = new Image();
	this.img.src = "images/explosion.png";
	this.animation = 0;
};

Explosion.prototype = {
	x: this.x,
	y: this.y,
	
	update: function(elapsedTime) {
		this.animation++;
		// account for world scrolling
		if(this.scrolling.right == true) {
			this.x -= 5;
		}
		else if(this.scrolling.left == true) {
			this.x +=5;
		}
	},
	
	render: function(context) {
		context.save();
		context.translate(this.x, this.y);
		if(this.animation < 5) {
			context.drawImage(this.img, 16, 18, 16, 16, 0, 0, 16, 16);
		} else if(this.animation < 10) {
			context.drawImage(this.img, 56, 9, 31, 27, 0, 0, 31, 27);
		} else if(this.animation < 15) {
			context.drawImage(this.img, 99, 4, 40, 38, 0, 0, 40, 38);
		} else if(this.animation < 20) {
			context.drawImage(this.img, 144, 0, 46, 45, 0, 0, 46, 45);
		} else if(this.animation < 25) {
			context.drawImage(this.img, 192, 0, 44, 43, 0, 0, 44, 43);
		} else if(this.animation < 30) {
			context.drawImage(this.img, 2, 52, 42, 40, 0, 0, 42, 40);
		} else if(this.animation < 35) {
			context.drawImage(this.img, 53, 53, 39, 38, 0, 0, 39, 38);
		} else {
			this.parent.destroyed = true;;
		}
		context.restore();
	},
}