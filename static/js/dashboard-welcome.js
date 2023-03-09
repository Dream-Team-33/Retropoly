/**The code contains animation for the letters found on the page.
 * What will happen is that the words will sort of "cancel" out 
 * and show other words.
 */

//Declare a variable to display dynamic text
var typed = new Typed(".auto-type", {
    strings: ["Click on 'Dashboard' to start the game",
              "Or click on the 'Rules' tab to understand the rules of the game.",
              "'Teams' tab is to view your team...",
              "...while 'Notes' is cliché"
            ],
            //Speed of the text will be 50 when typing,
            //and 10 when cancelling out.
            typeSpeed: 50, 
            backSpeed: 10,
            loop: true
})