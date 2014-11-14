// GUI class
//----------------------------------
var GUI = function(game) {
	var self = this;
	
	this.game = game;
	this.oldLives = 0;
	this.oldHealth = 100;
	
	// GUI panels
	this.center = document.getElementById("gui-center");
	this.topLeft = document.getElementById("gui-top-left");
	this.topCenter = document.getElementById("gui-top-center");
	this.topRight = document.getElementById("gui-top-right");
	this.bottomLeft = document.getElementById("gui-bottom-left");
	this.bottomCenter = document.getElementById("gui-bottom-center");
	this.bottomRight = document.getElementById("gui-bottom-right");
	
	// Health bar elements
	this.healthBar = document.createElement('span');
	this.healthBar.className = "health-bar";
	this.healthBackground = document.createElement('span');
	this.healthBackground.className = "health-background";
	this.healthBackground.appendChild(this.healthBar);
	this.topCenter.appendChild(this.healthBackground);
	
	// Missile display elemnets
	this.missileIcon = document.createElement('span');
	this.missileIcon.className = "missile-icon";
	this.bottomLeft.appendChild(this.missileIcon);
	this.missileCount = document.createElement('span');
	this.bottomLeft.appendChild(this.missileCount);
	
	// Display message on center of screen
	this.message = function(message) {
		self.center.innerHTML = message;
	},
	
	this.render = function(context) {
		var scaleX = (WIDTH - 50.0)/LEVEL_LENGTH, 
			scaleY = 50.0/HEIGHT;
		
		// Render mini-map
		context.drawImage(this.game.parallaxLayers[0].image, 25, 25, WIDTH-50, 50);
		context.save();
		context.fillStyle = "green";
		context.beginPath();
		context.arc(25 + this.game.heli.x * scaleX, 25 + this.game.heli.y *scaleY, 3, 0, 2*Math.PI);
		context.fill();
		context.fillStyle = "red";
		this.game.targets.forEach( function(target) {
			context.beginPath();
			context.arc(25 + target.x * scaleX, 25 + target.y * scaleY, 2, 0, 2*Math.PI);
			context.fill();
		});
		context.restore();
		
		// TODO: Render Health
		if(this.oldHealth !== this.game.health) {
			this.healthBar.style.width = Math.max(this.game.health, 0) + "%";
			this.oldHealth = this.game.health;
		}
		
		// TODO: Render Lives
		if(this.oldLives !== this.game.lives) {
			this.topLeft.innerHTML = "";
			for(i = 0; i < this.game.lives; i++) {
				var lifeIcon = document.createElement("span");
				lifeIcon.className = "life";
				this.topLeft.appendChild(lifeIcon);
			}
			this.oldLives = this.game.lives;
		}
		// TODO: Render Missiles
		this.missileCount.innerHTML = " x " + this.game.heli.missiles;
		
		// TODO: Render Score
		this.topRight.innerHTML = this.game.score;
		
	}
}