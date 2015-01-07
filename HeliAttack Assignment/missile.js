// Missile.js
PI = Math.PI;

var Missile = function(x, y, tx, ty, scrolling, id) {
	this.id = id;
	
	// position variables
	this.x = x;
	this.y = y;
	this.tx = tx + 10;
	this.ty = ty - 15;
	
	// movement variables
	this.speed = 0.5;
	this.magnitude = Math.sqrt(Math.pow(this.tx-x, 2) + Math.pow(this.ty-y, 2))
	this.v = new Vector((this.tx-x) / this.magnitude,(this.ty-y) / this.magnitude);
	this.scrolling = scrolling;
	this.angle = this.getAngle();
	
	// rendering variables
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "images/helicopter.png";
	this.animation = 0;
	this.explosion = null;
	this.radius = 4;
};

Missile.prototype = {

	getAngle: function() {
		// gets the angle and corrects it because atan returns -pi/2 -> pi/2
		angle = Math.atan((this.ty - this.y) / (this.tx - this.x));
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
	
	update: function(elapsedTime) {
		this.x += elapsedTime * this.v.x * this.speed;
		this.y += elapsedTime * this.v.y * this.speed;
		
		// account for world scrolling
		if(this.scrolling.right == true) {
			this.x -= 5;
			this.tx -= 5;
		}
		else if(this.scrolling.left == true) {
			this.x += 5;
			this.tx += 5;
		}
		
		// explode once target destination reached
		if(this.tx - this.x < 10 && this.tx - this.x > -10) {
			if(this.ty - this.y < 10 && this.ty - this.y > -10) {
				this.destroy();
			}
		}
		
		// animation loop
		this.animation++;
		if(this.animation >= 30) {
			this.animation = 0;
		}
		
		if(this.explosion != null) {
			this.explosion.update(elapsedTime);
		}
	},
	
	render: function(context) {
		// check for an explosion
		if(this.explosion != null) {
			this.explosion.render(context);
		}
		else {
			context.save();
			context.translate(this.x, this.y + 30)
			context.translate(8, 4);
			context.rotate(this.angle);
			context.drawImage(this.sprite_sheet, 75, 56, 17, 8, 0, 0, 17, 8);
			if(this.animation < 10) {
				context.drawImage(this.sprite_sheet, 37, 56, 10, 6, -5, 0, 10, 6);
				context.drawImage(this.sprite_sheet, 23, 56, 6, 7, -11, 0, 7, 6);
			} else if (this.animation < 20) {
				context.drawImage(this.sprite_sheet, 50, 56, 8, 6, -5, 0, 8, 6);
				context.drawImage(this.sprite_sheet, 8, 56, 10, 6, -11, 0, 10, 6);
			} else {
				context.drawImage(this.sprite_sheet, 62, 56, 4, 8, -5, 0, 4, 8);
				context.drawImage(this.sprite_sheet, 23, 56, 6, 7, -9, 0, 7, 6);
			}
			context.restore();
		}
	},
	
	destroy: function() {
		this.explosion = new Explosion(this.x, this.y, this.scrolling, this);
	}
}