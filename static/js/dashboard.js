//socketIO connection verification
var socket = io();
socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on("new_hours", function(data) {
    new_hours_text = data['newHoursText']
    const taskElement = selectedTask.closest(".task");
    updateHoursRemaining(taskElement, new_hours_text);
  });
  
  

let selectedTask = null;
let hoursRemainingText = null; // Declare the variable here

function selectTask(taskElement) {
    //changes the name of taskelement to be selected task for clarity in the code
    selectedTask = taskElement;


    if (selectedTask !== null) {
<<<<<<< HEAD
    // Unselect the previously selected task
    selectedTask.classList.remove("selected-task");
    }
    
    // Select the new task
    selectedTask = taskElement;
    selectedTask.classList.add("selected-task");

    const hoursRemainingElement = taskElement.querySelector(".hoursRemaining");

    hoursRemainingText = hoursRemainingElement.textContent;
}

var elDiceOne = document.getElementById('dice1');
var elDiceTwo = document.getElementById('dice2');
var elComeOut = document.getElementById('roll');


elComeOut.onclick = function () {
    if (hoursRemainingText !== null) { // Make sure hoursRemainingText is defined
        rollDice(hoursRemainingText); // Pass the hoursRemainingText to rollDice
    } else {
        console.log("No task selected");
    }
};
  
function rollDice(hoursRemainingText) { // Accept the hoursRemainingText as a parameter
  var diceOne = Math.floor((Math.random() * 6) + 1);
  var diceTwo = Math.floor((Math.random() * 6) + 1);

  socket.emit('diceroll', {diceRollValues:[diceOne,diceTwo, hoursRemainingText]}); // Pass the hoursRemaining text value

  for (var i = 1; i <= 6; i++) {
    elDiceOne.classList.remove('show-' + i);
    if (diceOne === i) {
      elDiceOne.classList.add('show-' + i);
    }
  }

  for (var k = 1; k <= 6; k++) {
    elDiceTwo.classList.remove('show-' + k);
    if (diceTwo === k) {
      elDiceTwo.classList.add('show-' + k);
    }
  }
}

function updateHoursRemaining(taskElement, newHoursText) {
    const hoursRemainingElement = taskElement.querySelector(".hoursRemaining");
    hoursRemainingElement.textContent = (newHoursText.toString() + "hrs");
    taskElement.classList.remove("selected-task");
}
=======
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
>>>>>>> b266defa5104acf26a25e8b64475532c04d9be04
