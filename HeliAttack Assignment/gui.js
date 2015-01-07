// GUI class
//----------------------------------

var minimap = new Image();
minimap.src = "images/minimap.png";

var GUI = function(game) {
	this.game = game;
	this.health = 10;
	this.lives = 3;
	this.missiles = 3;
	this.score = 0;
	
	// GUI panels
	this.topLeft = document.getElementById("gui-top-left");
	this.topCenter = document.getElementById("gui-top-center");
	this.topRight = document.getElementById("gui-top-right");
	this.bottomLeft = document.getElementById("gui-bottom-left");
	this.bottomCenter = document.getElementById("gui-bottom-center");
	this.bottomRight = document.getElementById("gui-bottom-right");
}

GUI.prototype = {
	
	update: function(elapsedTime) {
		// update info
		this.health = this.game.heli.health;
		this.lives = this.game.heli.lives;
		this.missiles = this.game.heli.numMissiles;
		this.score = this.game.score;
	},
	
	render: function(context) {
		// render info
		this.topCenter.innerHTML = "Health: " + this.health;	
		this.topLeft.innerHTML = "Lives: " + this.lives;
		this.bottomLeft.innerHTML = "Missiles: " + this.missiles;
		this.topRight.innerHTML = "Score: " + this.score;
		
		// render mini map
		context.drawImage(minimap, 700, 430);
		context.strokeStyle = "#000000";
		context.fillStyle = "#000000";
		context.beginPath();
		context.arc(700 + (this.game.sx / 140), 455, 2, 2*PI, false);
		context.fill();
		context.stroke();
	}
}