//socketIO connection verification
var socket = io();
socket.on("connect", () => {
	console.log("Connected to server");
});

socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

socket.on("new_hours", function (data) {
	new_hours_text = data["newHoursText"];
	const taskElement = selectedTask.closest(".task");
	updateHoursRemaining(taskElement, new_hours_text);
});

let selectedTask = null;
let hoursRemainingText = null; // Declare the variable here

function selectTask(taskElement) {
	//changes the name of taskelement to be selected task for clarity in the code
	selectedTask = taskElement;

	if (selectedTask !== null) {
		// Unselect the previously selected task
		selectedTask.classList.remove("selected-task");
	}
	var parent = selectedTask.parentNode;
	console.log(parent);
	// rest of your code that uses parent

	// checks to see if the classes within the parent node of the slected task contains either 'backlog' or 'done'
	if (
		parent.classList.contains("backlog") ||
		parent.classList.contains("done")
	) {
		//
		// popup should appear explaining why they cannot select the card that they have selected
		//
		//

		// debuggign console log to tell us that they card is not a valid choice
		console.log("backlog or done detected please choose a valid card!");
	} else {
		// Select the new task
		// adds selected-task class to the class list of the parent node of the button clicked to select the card
		selectedTask.classList.add("selected-task");
		const hoursRemainingElement = taskElement.querySelector(".hoursRemaining");
		hoursRemainingText = hoursRemainingElement.textContent;
	}

	//TODO: disallow the user to reroll on something that is selected and is within the done section or backlog(should be impossible to go back to backlog)
}

var elDiceOne = document.getElementById("dice1");
var elDiceTwo = document.getElementById("dice2");
var elComeOut = document.getElementById("roll");

elComeOut.onclick = function () {
	if (hoursRemainingText !== null) {
		// Make sure hoursRemainingText is defined
		rollDice(hoursRemainingText); // Pass the hoursRemainingText to rollDice
	} else {
		console.log("No task selected");
	}
};

function rollDice(hoursRemainingText) {
	// Accept the hoursRemainingText as a parameter
	var diceOne = Math.floor(Math.random() * 6 + 1);
	var diceTwo = Math.floor(Math.random() * 6 + 1);

	socket.emit("diceroll", {
		diceRollValues: [diceOne, diceTwo, hoursRemainingText],
	}); // Pass the hoursRemaining text value

	for (var i = 1; i <= 6; i++) {
		elDiceOne.classList.remove("show-" + i);
		if (diceOne === i) {
			elDiceOne.classList.add("show-" + i);
		}
	}

	for (var k = 1; k <= 6; k++) {
		elDiceTwo.classList.remove("show-" + k);
		if (diceTwo === k) {
			elDiceTwo.classList.add("show-" + k);
		}
	}
}

function updateHoursRemaining(taskElement, newHoursText) {
	const hoursRemainingElement = taskElement.querySelector(".hoursRemaining");
	hoursRemainingElement.textContent = newHoursText.toString() + "hrs";
	taskElement.classList.remove("selected-task");
	selectedTask == null;
}




/**
 * This is for the sprint tracker. It will be used to display
 * the sprint time tracker during the game.
 */
const startingMinutes = 20; // This will set the timer to start at 20 minutes

let time = startingMinutes * 60; // This will have the segments

const countdownEl = document.getElementById("countdown"); // This will get the element with the id of countdown

setInterval(updateCountdown, 1000); // This will update the countdown every second


//have a function that will update the time every second
function updateCountdown(){
	const minutes = Math.floor(time / 60); // This will get the minutes
	let seconds = time % 60; // This will get the seconds

	seconds = seconds < 20 ? '0' + seconds : seconds; // This will add a 0 to the seconds if it is less than 20

	countdownEl.innerHTML = `${minutes}:${seconds}`; // This will display the time in the countdown element
	time--; // This will decrement the time by 1 second
}

/**
 * This is for the game tracker. It will be used to count (track)
 * time during the game.
 */
var timer = document.getElementById("timer");
var totalSeconds = 0;

setInterval(setTime, 1000);

// Function to update the timer display
function setTime() {
 
  ++totalSeconds; // Increment the total number of seconds

  // Calculate the number of hours, minutes, and seconds
  var hours = pad(parseInt(totalSeconds / 3600));
  var minutes = pad(parseInt((totalSeconds % 3600) / 60));
  var seconds = pad(totalSeconds % 60);

  var timeString = hours + ":" + minutes + ":" + seconds;

  timer.innerHTML = timeString;  // Update the timer display
}

// Function to pad a number with leading zeros if necessary
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
