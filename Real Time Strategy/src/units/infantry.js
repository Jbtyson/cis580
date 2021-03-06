//Ryan Woodburn
//Adapted off of hoplite

UNIT_SPRITE_DATA = [ {x:0, y: 0, width: 32, height: 32, animationFrames: 12} ];

var Infantry = function(x, y, faction, game) {
	this.game = game;
	this.maxhealth = 30;
	this.health = this.maxhealth;
	
	this.radius = 16;
	this.borderwidth = 3;
	// in pixels per second
	this.maxvel = 100;
	// in health per second
	this.damage = 6;
	this.range = 60;
	this.maxResources = 20;
	this.resources = 0;
	this.animationFrame = 0;
	this.animationTime = 0;
	
	this.x = x;
	this.y = y;
	this.faction = faction;
	this.type = "infantry";

	
	// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Unit icon for the unit bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare action functions here
	this.testAction = function() {
		console.log("test action performed");
	};
	// Declare array of actions here
	this.actions = [
		{ 
			thumbnail:Resource.gui.img.villagerCommandButton, 
			tooltipText:"Sample text to pretend to be a tooltip.", 
			onClick:this.testAction 
		},
	];
	// -----------------------------------------------------------------------------
}

Infantry.prototype = new Unit(this.x,this.y,this.maxhealth,this.faction);

Infantry.prototype.render = function(context) {
		//draw unit
		context.drawImage(Resource.units.img.soldier[this.faction],
			UNIT_SPRITE_DATA[0].x + UNIT_SPRITE_DATA[0].width * this.animationFrame, UNIT_SPRITE_DATA[0].y,
			UNIT_SPRITE_DATA[0].width, UNIT_SPRITE_DATA[0].height,
			this.x - globalx - this.radius, this.y - globaly - this.radius,
			UNIT_SPRITE_DATA[0].width, UNIT_SPRITE_DATA[0].height);
			
		// draw health bar
		var maxbarlength = this.radius*2;
		var barheight = 4;
		var barlength = maxbarlength * (this.health/this.maxhealth);
		context.fillStyle = "#00FF00";
		context.beginPath();
		context.rect(this.x -(maxbarlength/2)-globalx, this.y - this.radius/2 - (barheight/2)-globaly,	barlength, barheight);
		context.fill();
		context.restore();
		
		if(this.selected) {
			context.drawImage(Resource.units.img.unitSelector,
				this.x - globalx - this.radius, this.y - globaly - this.radius);
		}
}
/*
Infantry.prototype.update = function(elapsedTime) {
	var self = this;

	var secs = elapsedTime / 1000;
	if (self.mode == "move" ||
			(self.mode == "attack" && !self.game.cd.detect(self.targetunit, self))) {
		if (self.mode == "attack") {
			self.move(self.targetunit.x, self.targetunit.y);
			self.mode = "attack";
		}
		
		var deltaxi = self.targetx - self.x;
		var deltayi = self.targety - self.y;
		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
		// stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = self.targetx - self.x;
			var deltayf = self.targety - self.y;
			//var deltayf = self.targety - self.y;
			if (deltaxi/deltaxf < 0 || deltaxi/deltaxf < 0) {
				self.velx = 0;
				self.vely = 0;
				self.mode = "idle";
			}
			
			this.animationTime += elapsedTime;
	  
			if(this.animationTime >= 50){
				this.animationTime = 0;
				this.animationFrame = (this.animationFrame + 1) % UNIT_SPRITE_DATA[0].animationFrames;
			}
		}
	}
	
	else if (self.mode == "attack" && self.game.cd.detect(self.targetunit, self)) {
		self.targetunit.health -= self.damage*secs;
		//console.log(self.targetunit.health);
		if (self.targetunit.health <= 0) {
			self.mode = "idle";
			self.targetunit = null;
		}
		this.animationTime += elapsedTime;
		this.animationFrame = 0;
	}
	
	else {
		this.animationTime += elapsedTime;
		this.animationFrame = 0;
	}
	self.game.factions.forEach( function(faction) {
		for (var i = 0; i <  faction.units.length; i++) {
			if (faction.units[i].faction != self.faction &&
					self.game.cd.detect(self, faction.units[i])) {
				self.attack(faction.units[i]);
			}
		}
	});
}
*/
Infantry.prototype.update = function(elapsedTime) {
	var self = this;

	var secs = elapsedTime / 1000;

	if (self.mode == "move" ||
			(self.mode == "attack" && !game.cd.detect(self.targetunit, self)) ||
			(self.mode == "attack_building" && !game.cd.detect(self.targetunit, self))) {
		if (self.mode == "attack") {
			self.targetx = self.targetunit.x;
			self.targety = self.targetunit.y;
			if(Math.floor(self.targetx/64) != self.nextNode.x || Math.floor(self.targety/64) != self.nextNode.y)
			{
				self.getPath(self.targetunit.x, self.targetunit.y);
			}
			self.mode = "attack";
		}
		else if (self.mode == "attack_building") {
			self.targetx = self.targetunit.world_x;
			self.targety = self.targetunit.world_y;
			if(Math.floor(self.targetx/64) != self.nextNode.x || Math.floor(self.targety/64) != self.nextNode.y)
			{
				self.getPath(self.targetunit.world_x, self.targetunit.world_y);
			}
			self.mode = "attack_building";
		}
		var deltaxi = self.nextx - self.x;
		var deltayi = self.nexty - self.y;

		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
		//update currentNode
		//self.curNode.x = Math.floor(self.x/64);
		//self.curNode.y = Math.floor(self.y/64);
		
		// start moving to the next node or stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = self.nextx - self.x;
			var deltayf = self.nexty - self.y;
			if ((deltaxi/deltaxf < 0 || deltayi/deltayf < 0) || (deltaxf == 0 && deltayf == 0)) {
				self.velx = 0;
				self.vely = 0;
				if(self.nextx != self.targetx && self.nexty != self.targety)
				{
					self.getNextDest();
				}
				else
				{
					self.velx = 0;
					self.vely = 0;
					self.mode = "idle";
				}
			}
			this.animationTime += elapsedTime;
	  
			if(this.animationTime >= 50){
				this.animationTime = 0;
				this.animationFrame = (this.animationFrame + 1) % UNIT_SPRITE_DATA[0].animationFrames;
			}
		}
	}
	
	else if ((self.mode == "attack" && self.game.cd.detect(self.targetunit, self)) ||
			(self.mode == "attack_building" && self.game.cd.detect(self.targetunit, self))) {
		self.targetunit.health -= self.damage*secs;
		//console.log(self.targetunit.health);
		if (self.targetunit.health <= 0) {
			self.mode = "idle";
			self.targetunit = null;
		}
		this.animationTime += elapsedTime;
		this.animationFrame = 0;
	}
	
	else if (self.mode == "idle") {
		self.game.factions.forEach( function(faction) {
			for (var i = 0; i <  faction.units.length; i++) {
				var otherUnit = {
						getHitbox: function()
						{
							return faction.units[i].getHitbox();
						},
						getAttackRange: function()
						{
							return faction.units[i].getHitbox();
						}
					}
				if (faction.units[i].faction != self.faction &&
						self.game.cd.detect(self, faction.units[i])) {
					self.attack(faction.units[i]);
				}
				else if (faction.units[i].faction == self.faction &&
						game.cd.detect(self, otherUnit) && self != faction.units[i] && faction.units[i].mode == "idle") {
					self.loseStack(faction.units[i]);
				}
			}
		});
		this.animationTime += elapsedTime;
		this.animationFrame = 0;
	}
}

Infantry.prototype.getHitbox = function() {
	var self = this;
	
	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius
	};
}

Infantry.prototype.getAttackRange = function() {
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius + self.range
	};
}

/*
Infantry.prototype.move = function(x, y) {
	var self = this;

	self.mode = "move";
	self.targetx = x;
	self.targety = y;
	
	var deltax = x - self.x;
	var deltay = y - self.y;
	
	self.velx = Math.sqrt((self.maxvel*self.maxvel * deltax*deltax) /
			(deltax*deltax + deltay*deltay));
	self.vely = Math.sqrt((self.maxvel*self.maxvel * deltay*deltay) /
			(deltax*deltax + deltay*deltay));
	if (self.velx/deltax < 0) {
		self.velx *= -1;
	}
	if (self.vely/deltay < 0) {
		self.vely *= -1;
	}
}
*/

Infantry.prototype.startMine = function(mine) {
	var self = this;

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}
