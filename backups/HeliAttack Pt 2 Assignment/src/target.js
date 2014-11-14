
// Target class
//----------------------------------
var Target = function(game, x, y, bounce) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.bounce = bounce;
  this.timer = 0.0;
};

Target.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	radius: 30,
	
	render: function(context) {
		var y = this.y + this.bounce * Math.sin(this.timer);
		
		context.save();
		
		context.fillStyle = "gray";
		context.strokeStyle = "black";
		
		context.beginPath();
		context.arc(this.x, y, 30, Math.PI/2, -3*Math.PI/2);
		context.lineTo(this.x + 5, y + 40);
		context.lineTo(this.x - 5, y + 40);
		context.closePath();
		context.fill();
		context.stroke();
		
		context.fillStyle = "white";
		context.strokeStyle = "red";
		context.lineWidth = 5;
		
		context.beginPath();
		context.arc(this.x, y, 20, 0, 2*Math.PI);
		context.fill();
		context.stroke();
		
		context.beginPath();
		context.arc(this.x, y, 10, 0, 2*Math.PI);
		context.fill();
		context.stroke();
		
		context.beginPath();
		context.arc(this.x, y, 2, 0, 2*Math.PI);
		context.fillStyle = "black";
		context.fill();
		
		context.restore();
	},
	
	update: function(elapsedTime) {
		this.timer += 0.1;
	}
};