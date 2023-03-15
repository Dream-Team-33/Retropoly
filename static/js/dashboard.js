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
    if (selectedTask !== null) {
    // Unselect the previously selected task
    selectedTask.classList.remove("-selected");
    }
    
    // Select the new task
    selectedTask = taskElement;
    selectedTask.classList.add("-selected");

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
    taskElement.classList.remove("-selected");
}
