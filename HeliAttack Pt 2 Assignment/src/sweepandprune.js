
// SweepAndPrune class
//----------------------------------
var SweepAndPrune = function() {

}

SweepAndPrune.protoytype = {
	addObject: function(object) {
	
	},
	
	updateObject: function(box, object) {
	
	},
	
	removeObject: function(object) {
	
	}
}


// Box class
//----------------------------------
var Box = function(data, min, max) {
	this.data = data;
	this.min = min;
	this.max = max;
}

Box.protoytype = {
	
}

// Endpoint class
//----------------------------------
var Endpoint = function(owner, value, isMin) {
	this.owner = owner;
	this.value = value;
	this.isMin = isMin;
	
}

Endpoint.protoytype = {
	
}

