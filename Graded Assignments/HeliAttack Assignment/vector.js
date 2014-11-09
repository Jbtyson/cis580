//Vector Class
var Vector = function (x, y) {
	this.x = x;
	this.y = y;
	
	add = function(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	},
	
	subtract = function(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}
};

Vector.prototype = {
	x: this.x,
	y: this.y,

	rotate: function(radians) {
		//new Vector(x * Math.cos(radians) ­ y * Math.sin(radians), x * Math.sin(radians) ­ y * Math.cos(radians));
	},
	
	unitVector: function() {
		magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		return new Vector(this.x/magnitude, this.y/magnitude)
	}
}

