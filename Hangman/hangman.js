$(function() {
	game();
	
	$('#restart').on('click', function() {
		console.log("FOO");
		game();
	}); 
});

game = function() {
	// set up on click for letters
	$('#letters').on('click', 'span', function() {
		update(this.id);
	});
	
	// get and display the secret word
	secret = words[Math.floor(Math.random() * words.length)]
	displaySecret(secret);
	
	// initialize the scaffold
	var parts = 0;
	
	// checks a character code for upper and lowe case letters
	function isLetter(charCode) {
		if((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// checks a string for a letter
	function contains(word, letter) {
		return (word.indexOf(letter.toLowerCase()) > -1);
	}
	
	// checks if a letter has been picked and if not changes the color and marks it picked
	function  tryMarkLetter(letter) {
		if(document.getElementById(letter).style.color!="red") {
			document.getElementById(letter).style.color="red";
			return true;
		}
		console.log("already clicked, taking no actions");
		return false;
	}
	
	// replaces a blank with the correct letter if a correct guess
	function replaceBlank(letter) {
		num = secret.indexOf(letter.toLowerCase())
		// replace the blank
		// change the letter to "."
	}

	// draws a body part on the scaffold for a wrong guess
	function drawBodyPart() {
		parts++;
		console.log(parts + " wrong guesses");
	}

	// displays the initial spaces of the secret word
	function displaySecret(secret) {	
		for(i = 0; i < secret.length; i++) {
			if(isLetter(secret.charCodeAt(i))) {
				$('<td>&nbsp;</td>').appendTo('#word');
			} else {
				$('<td class = "special">' + secret[i] + '</td>').appendTo('#word')
			}	
		}
	}
	
	// called on a letter being picked, updates game state
	function update(id) {
		//get the letter clicked
		var letter = id;
		console.log(letter + " chosen");
		
		// try to mark the letter as picked (the function returns true if it hasnt been picked)
		if(tryMarkLetter(letter)) {			
			// check for a correct guess
			if(contains(secret, letter)) {
				//replace blank
				replaceBlank(letter)
			} else {
				//add body parts
				drawBodyPart(parts);
			}
		}	
	}
}
