//socketIO connection verification
var socket = io();
socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});

let selectedTask = null;

function selectTask(taskElement) {
    //changes the name of taskelement to be selected task for clarity in the code
    selectedTask = taskElement;


    if (selectedTask !== null) {
        // Unselect the previously selected task
        selectedTask.classList.remove("selected-task");
    }
    
    var parent = selectedTask.parentNode;
    console.log(parent)
    // rest of your code that uses parent

    // checks to see if the classes within the parent node of the slected task contains either 'backlog' or 'done'
    if (parent.classList.contains('backlog') || parent.classList.contains('done')) {
        //
        // popup should appear explaining why they cannot select the card that they have selected
        //
        //
        
        // debuggign console log to tell us that they card is not a valid choice
        console.log("backlog or done detected please choose a valid card!")
    }
    else
    {
        // Select the new task
        // adds selected-task class to the class list of the parent node of the button clicked to select the card
        selectedTask.classList.add("selected-task");
    }

    //TODO: disallow the user to reroll on something that is selected and is within the done section or backlog(should be impossible to go back to backlog)
 
}