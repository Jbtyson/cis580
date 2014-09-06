$(function() {
    game();

    $('#restart').on('click', function() {
        game();
    });
});

game = function() {
    // set game message
    updateGameMessage("Game is on!");

    // clear existing secret word
    $('#word').html('');

    // reset the scaffold
    $('#drawing').attr('src', 'scaffold-0.png');

    // reset the picked letters
    var letters = document.getElementsByClassName("letter");
    for (i = 0; i < letters.length; i++) {
        letters[i].style.color = "black";
    }

    // remove on click listeners and then add them back on
    $('#letters').off('click', 'span').on('click', 'span', function() {
        clickLetter(this.id);
    });

    // remove/add the key press listeners
    $(document).off('keypress').keypress(function(e) {
        key = (String.fromCharCode(e.which)).toUpperCase();
        if(isLetter(key.charCodeAt(0))) {
            clickLetter(key);
        }
    });

    // get and display the secret word, then convert it to upper-case for easier searching
    var secret = {val : words[Math.floor(Math.random() * words.length)] }
    displaySecret(secret.val);
    secret.val = secret.val.toUpperCase();
    secret.orig = secret.val;
    var gameOver = false;

    // initialize the scaffold
    var parts = 0;

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
    function clickLetter(id) {
        if(!gameOver) {
            // get the letter clicked
            var letter = id;
            // try to mark the letter as picked (the function returns true if it has not been picked)
            if (tryMarkLetter(letter)) {
                // check secret for the letter clicked, true if found
                if (contains(secret, letter)) {
                    //replace the blank with the letter
                    replaceBlank(secret, letter);
                    // check for a win
                    if (checkForWin(secret)) {
                        // update the game message to win
                        updateGameMessage("Congratulations! You guessed " + secret.orig);
                        gameOver = true;
                    }
                }
                else {
                    //add body parts
                    drawBodyPart(parts);

                    //if  6 body parts are present end the game
                    if (parts == 6) {
                        updateGameMessage("You lose! The word was " + secret.orig);
                        gameOver = true;
                    }
                }
            }
            // if a letter has already been picked the code will skip to here and do nothing
        }
    }

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
    function contains(secret, letter) {
        return (secret.val.indexOf(letter) > -1);
    }

    // checks if a letter has been picked and if not changes the color and marks it picked
    function  tryMarkLetter(letter) {
        // check for a letter being picked by checking the color
        if(document.getElementById(letter).style.color != "red") {
            // change the color to red
            document.getElementById(letter).style.color="red";
            return true;
        }
        // do nothing if the letter has already been clicked
        return false;
    }

    // replaces a blank with the correct letter if a correct guess
    function replaceBlank(secret, letter) {
        index = secret.val.indexOf(letter)

        // get the cell and replace the blank with the correct letter
        table = document.getElementById('word');
        cells = table.getElementsByTagName('td');
        cells[index].innerHTML = letter;

        // change the letter in the secret word to"." so we can check for others
        secret.val = secret.val.substr(0, index) + "." + secret.val.substr(index+1)

        // recursively check again
        if(contains(secret, letter)) {
            replaceBlank(secret, letter);
        }
    }

    // draws a body part on the scaffold for a wrong guess
    function drawBodyPart() {
        parts++;
        $("#drawing").attr('src', 'scaffold-' + parts+ ".png");
    }

    // checks for a win
    function checkForWin(secret) {
        for(i = 0; i < secret.val.length; i++) {
            // check for the presence of letters, if there are there are the game is not over
            if(isLetter(secret.val.charCodeAt(i))) {
                return false;
            }
        }
        // there are no letters left in the word, so the game is over
        return true;
    }

    // updates message for when the game is over
    function updateGameMessage(message) {
        msg = document.getElementById("gameOver");
        msg.innerHTML = message;
    }

}//end game()