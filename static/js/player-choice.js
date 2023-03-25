/**This contains the function of a button for
 * users to select the number of players.
 */

// initialise the number of players to 0
let numPlayers = 0;
// check for all the buttons present in the page
const buttons = document.querySelectorAll('button');

// add event listener to each button
buttons.forEach(button => {
    // adds the click event listener to them
    button.addEventListener('click', function() {
        // store the id of the button in the variable numPlayers
        numPlayers = this.id;
        // call the function to set the number of players passing the var numPlayers
        setNumPlayers(numPlayers);
    });
});


// function to set the number of players
function setNumPlayers(numPlayers) {
    // store the number of players in the session storage (will be contstant as long as they dont close the page :) )
    sessionStorage.setItem("numPlayers", numPlayers);
    // set the current player to 1
    sessionStorage.setItem("currentPlayer", 1);
    // send the user to the welcome page
    window.location.href = '/dashboard-welcome/'
}
