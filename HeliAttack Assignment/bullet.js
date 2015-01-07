// Bullet.js
PI = Math.PI;

var Bullet = function(x, y, tx, ty, scrolling, id) {
	this.id = id;
	
	// position variables
	this.x = x + 40;
	this.y = y + 30;
	this.tx = tx;
	this.ty = ty - 15;
	
	// movement variables
	this.scrolling = scrolling;
	this.speed = 1;
	this.magnitude = Math.sqrt(Math.pow(this.tx-x, 2) + Math.pow(this.ty-y, 2))
	this.v = new Vector((this.tx-x) / this.magnitude,(this.ty-y) / this.magnitude);
	
	// rendering variables
	this.radius = 3;
	this.destroyed = false;
};

Bullet.prototype = {
	x: this.x,
	y: this.y,
	tx: this.tx,
	ty: this.ty,
	speed: this.speed,
	v: this.v,
	id: this.id,
	
	update: function(elapsedTime) {
		this.x += elapsedTime * this.v.x * this.speed;
		this.y += elapsedTime * this.v.y * this.speed;
		
		// account for scrolling
		if(this.scrolling.right == true) {
			this.x -= 5;
			this.tx -= 5;
		}
		else if(this.scrolling.left == true) {
			this.x += 5;
			this.tx += 5;
		}
		
		// destroy off of screen
		if(this.x > 800 || this.x < 0 || this.y > 480 || this.y < 0) {
			this.destroy();
		}
	},
	
	render: function(context) {
		context.save();
		context.strokeStyle = "#000000";
		context.fillStyle = "#ffff00";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*PI, false);
		context.fill();
		context.stroke();
		context.restore();
	},
	
	destroy: function() {
		this.destroyed = true;
	}
}