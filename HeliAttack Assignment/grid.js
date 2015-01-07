// Grid.js
var GRID_SIZE = 5; // 5x5 grid

var Grid = function(sWidth, sHeight) {
	this.granularity = { h: sWidth/GRID_SIZE, v: sHeight/GRID_SIZE };
	this.cellWidth = this.granularity.h;
	this.cellHeight = this.granularity.v;
	this.sWidth = sWidth;
	this.sHeight = sHeight;
	this.length = GRID_SIZE*GRID_SIZE;
	this.cells = [length];
	for(i = 0; i < this.length; i++) {
		this.cells[i] = null;
	}
};

Grid.prototype = {
	// adds an item to its respective cell based on position
	add: function(item) {
		// clamp inputs
		x = item.x;
		if(x < 0) { x = 0; } 
		else if(x > this.sWidth) { x = this.sWidth - 1; } 
		
		y = item.y;
		if(y < 0) { y = 0; } 
		else if(y > this.sHeight) { y = this.sHeight - 1; } 
	
		item.cell = Math.floor(x/this.cellWidth) + (Math.floor(y/this.cellHeight) * GRID_SIZE);
		// add it to the front of the linked list
		item.prev = null;
		item.next = this.cells[item.cell]
		this.cells[item.cell] = item;
		if(item.next != null && typeof(item.next) != "undefined") {
			item.next.prev = item;
		}
	},
	
	// removes an item from its cell
	remove: function(item) {
		if(item.prev != null) {
			item.prev.next = item.next;
		}
		if(item.next != null) {
			item.next.prev = item.prev;
		}
		if(this.cells[item.cell] == item) {
			this.cells[item.cell] = item.next;
		}
		item.next = null;
		item.prev = null;
	},
	
	// moves an item from one cell to another
	move: function(item) {
		// clamp inputs
		x = item.x;
		if(x < 0) { x = 0; } 
		else if(x > this.sWidth) { x = this.sWidth - 1; } 
		
		y = item.y;
		if(y < 0) { y = 0; } 
		else if(y > this.sHeight) { y = this.sHeight - 1; } 
	
		if (item.cell != Math.floor(x/this.cellWidth) + (Math.floor(y/this.cellHeight) * GRID_SIZE)) {
			this.remove(item);
			this.add(item);
		}
	},
	
	// checks for a collision between items
	handleitem: function(item, other) {
		var temp = other;
		// iterate through all of the items
		while(temp != null && typeof(temp) != "undefined") {
			dif = Math.sqrt(Math.pow(item.x - temp.x, 2) + Math.pow(item.y - temp.y, 2))
			distance = item.radius + temp.radius;
			
			if(dif <= distance) {
				this.handleCollision(item, temp)
			}
			temp = temp.next;
		}
	},
	
	// checks all items within a cell
	handleCell: function(cell) {
		var temp = this.cells[cell];
		
		// iterate through all of the items
		while(temp != null && typeof(temp) != "undefined") {
			this.handleitem(temp, temp.next);

			// check neighbouring cells
			x = cell % GRID_SIZE;
			y = (cell - x) / GRID_SIZE;
			
			// top left
			if (x > 0 && y > 0) {
				this.handleitem(temp, cell[GRID_SIZE * (y - 1) + (x - 1)]);
			}
			// left
			if (x > 0) {
				this.handleitem(temp, cell[GRID_SIZE * y + (x - 1)]);
			}
			//top
			if (y > 0) {
				this.handleitem(temp, cell[GRID_SIZE * (y - 1) + x]);
			}
			//bottom left
			if (x > 0 && y < this.cellHeight - 1) {
				this.handleitem(temp, cell[GRID_SIZE * (y + 1) + (x - 1)]);
			}

			temp = temp.next;
		}
	},
	
	// handles a collision between two items
	handleCollision: function(item, other) {
		item.destroy();
		other.destroy();
	},

}