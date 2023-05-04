/**The code contains animation for the letters found on the page.
 * What will happen is that the words will sort of "cancel" out
 * and show other words.
 */

//Declare a variable to display dynamic text
var typed = new Typed(".auto-type", {
	strings: [
		"",
		"Welcome aboard! &#128518;",
		"Click on 'Dashboard' to start the game",
		"You will find 'Rules' to understand the rules of the game...",
		"...while 'Notes' is cliché.",
		"Have fun!&#128540;",
	],
	//Speed of the text will be 50 when typing,
	//and 10 when cancelling out.
	typeSpeed: 20,
	backSpeed: 60,
	loop: true,
});

/**This contains the function of toggling a button for
 * users to select the number of players.
 */
function togglePopup() {
	document.getElementById("popup-1").classList.toggle("active");
}

/*This is for the preloader*/
//define the loader variable
var loader = document.getElementById("preloader");

//create an event function
window.addEventListener("load", function () {
	//hide the loader
	loader.style.display = "none";

	/**The loader works, however, it disappears very quickly
	 * when refreshing it, so what can be done is to have
	 * a video link (see profile.html for tag iframe) and
	 * paste it multiple times
	 */
});
