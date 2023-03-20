/**This contains the function of a button for
 * users to select the number of players.
 */
var btnlink = document.getElementById("btn-link"); // declaration of the button element

btnlink.addEventListener("click", function(){
    window.location.href = "/templates/dashboard-welcome.html"; // This will redirect to the Dashboard page
});
