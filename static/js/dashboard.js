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

// add jquery to the project automatically with the most up to date version
var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.6.3.min.js"; // Check https://jquery.com/ for the current version
document.getElementsByTagName("head")[0].appendChild(script);

let cardNum = 0;

let selectedTask = null;
let hoursRemainingText = null;
let taskSelectedAndRolled = false; // Add flag variable here

function selectTask(taskElement) {
	if (selectedTask !== null) {
		selectedTask.classList.remove("selected-task");
	}
	selectedTask = taskElement;
	var parent = selectedTask.parentNode;

	if (
		parent.classList.contains("backlog") ||
		parent.classList.contains("done")
	) {
		console.log("backlog or done detected please choose a valid card!");
	} else {
		selectedTask.classList.add("selected-task");
		const hoursRemainingElement = selectedTask.querySelector(".hoursRemaining");
		hoursRemainingText = hoursRemainingElement.textContent;
		taskSelectedAndRolled = false; // Reset flag variable
	}
}

var elDiceOne = document.getElementById("dice1");
var elDiceTwo = document.getElementById("dice2");
var elComeOut = document.getElementById("roll");

elComeOut.onclick = function () {
	if (hoursRemainingText !== null && !taskSelectedAndRolled) {
		// Check if flag variable is false
		rollDice(hoursRemainingText);
		taskSelectedAndRolled = true; // Set flag variable to true
	} else {
		console.log("No task selected or task already rolled");
	}
};

async function rollDice(hoursRemainingText) {
	// Accept the hoursRemainingText as a parameter
	var diceOne = Math.floor(Math.random() * 6 + 1);
	var diceTwo = Math.floor(Math.random() * 6 + 1);

	startQuiz(); // Call the startQuiz function

	//basic try catch to wait for the user to select an answer before continuing
	try {
		//sets response to the value returned by the selectAnswer function
		const response = await selectAnswer();
		//checks if the response is true or false and sends the appropriate reqest to the server
		if (response == "true") {
			console.log("Correct answer");
			socket.emit("diceroll2", {
				diceRollValues: [diceOne, diceTwo, hoursRemainingText],
			});
		} else {
			console.log("Incorrect answer");
			socket.emit("diceroll1", {
				diceRollValues: [diceOne, hoursRemainingText],
			});
		}
		//if there is an error it will be logged to the console
	} catch (error) {
		console.log(error);
	}

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
	updatePlayerNumber();
}

function updateHoursRemaining(taskElement, newHoursText) {
	const hoursRemainingElement = taskElement.querySelector(".hoursRemaining");
	hoursRemainingElement.textContent = newHoursText.toString() + "hrs";
	taskElement.classList.remove("selected-task");
	selectedTask == null;
}

// will be used to update the current player displayed in the html
function updatePlayerNumber() {
	//read the number of players and the current player from the session storage
	var numPlayersStored = sessionStorage.getItem("numPlayers");
	var currentPlayer = sessionStorage.getItem("currentPlayer");

	// set the currentPlayer number to the next number in the sequence as long as it is less than or equal to the number of players
	if (currentPlayer <= numPlayersStored - 1) {
		currentPlayer++;
		socket.emit("jsonRead", { socketid: socket.id });
	} else {
		currentPlayer = 1;
		updateSprintNum();
		showEval();
	}

	// set the current player number in the html
	sessionStorage.setItem("currentPlayer", currentPlayer);
	// set the current player number in the html to the current player number
	document.getElementById("currentPlayer").innerHTML = "Player: " + currentPlayer;
	document.getElementById("currentPlayerPopup").style.display = "block";
	// setTimeout(document.getElementById("currentPlayerPopup").style.display = "none", 2000) // this will make the popup disappear after 2 seconds
	//change the number 2000 to adjust the time the popup is displayed
	setTimeout(function () {
		document.getElementById("currentPlayerPopup").style.display = "none";
	}, 2000);
}

function updateSprintNum() {
	var sprintNum = sessionStorage.getItem("currentSprint");
	sprintNum++;
	sessionStorage.setItem("currentSprint", sprintNum);
	document.getElementById("sprintNum").innerHTML = "Sprint " + sprintNum;
}

function showEval() {
	setTimeout(function () {
		document.getElementById("evalCardsDiv").style.display = "block";
	}, 2000);
}

// event listener for the save button
document.getElementById("submitCards").addEventListener("click", saveCardInfo);
function saveCardInfo() {
	// takes each class od userInputEval and saves the id and value to the cardType and cardText variables
	$(".userInputEval").each(function () {
		cardType = this.id;
		cardText = this.value;

		//this then sends that data to the sever to be saved
		socket.emit(
			"jsonSave",
			{
				cardInfo: { card: (cardNum += 1), type: cardType, text: cardText },
				socketid: socket.id,
			},
			(Queue = "saveQueue")
		);

		// this will clear the text box after the data is saved
		this.value = "";
	});

	document.getElementById("evalCardsDiv").style.display = "none";
}

socket.on("recieveJson", function (data) {
	fileData = data;

	// read certain keys from the json object recieved from the server
	var cardType = fileData.cardInfo.type;

	switch (cardType) {
		case "keepDoing":
			setCard(fileData.cardInfo.type, fileData.cardInfo.text);
			break;
		case "doingBetter":
			setCard(fileData.cardInfo.type, fileData.cardInfo.text);
			break;
		case "stopDoing":
			setCard(fileData.cardInfo.type, fileData.cardInfo.text);
			break;
		default:
			break;
	}
});

function setCard(cardType, cardText) {
	// get the container for the card and the nested container for the text
	var cardContainer = document.querySelector("." + cardType);
	var nestedContainer = document.querySelector("." + cardType + " #cardTextPara");

	nestedContainer.innerHTML = cardText;
	
	// check what type of card is being sent and then display the correct cards
	switch (cardType) {
		case "keepDoing":
			cardContainer.style.display = "block";
			document.querySelectorAll(".doingBetter").forEach((a) => (a.style.display = "none"));
			document.querySelectorAll(".stopDoing").forEach((a) => (a.style.display = "none"));
			break;
		case "doingBetter":
			document.querySelectorAll(".keepDoing").forEach((a) => (a.style.display = "none"));
			cardContainer.style.display = "block";
			document.querySelectorAll(".stopDoing").forEach((a) => (a.style.display = "none"));
			break;
		case "stopDoing":
			document.querySelectorAll(".keepDoing").forEach((a) => (a.style.display = "none"));
			document.querySelectorAll(".doingBetter").forEach((a) => (a.style.display = "none"));
			cardContainer.style.display = "block";
			break;
		default:
			break;
	}

	// document.querySelectorAll(".keepDoing").forEach(a => a.style.display = "none");
	// document.querySelectorAll(".doingBetter").forEach(a => a.style.display = "none");
	// document.querySelectorAll(".stopDoing").forEach(a => a.style.display = "block");
}
/**
 * This is for the sprint tracker. It will be used to display
 * the sprint time tracker during the game.
 */
// const startingMinutes = 20; // This will set the timer to start at 20 minutes

// let time = startingMinutes * 60; // This will have the segments

// const countdownEl = document.getElementById("countdown"); // This will get the element with the id of countdown

// setInterval(updateCountdown, 1000); // This will update the countdown every second

// //have a function that will update the time every second
// function updateCountdown(){
// 	const minutes = Math.floor(time / 60); // This will get the minutes
// 	let seconds = time % 60; // This will get the seconds

// 	seconds = seconds < 20 ? '0' + seconds : seconds; // This will add a 0 to the seconds if it is less than 20

// 	countdownEl.innerHTML = `${minutes}:${seconds}`; // This will display the time in the countdown element
// 	time--; // This will decrement the time by 1 second
// }

/**
 * This is for the game tracker. It will be used to count (track)
 * time during the game.
 */
var timer = document.getElementById("timer");
var totalSeconds = 0;

setInterval(setTime, 1000); // Update the timer every second

// Function to update the timer display
function setTime() {
	++totalSeconds; // Increment the total number of seconds

	// Calculate the number of hours, minutes, and seconds
	var hours = pad(parseInt(totalSeconds / 3600));
	var minutes = pad(parseInt((totalSeconds % 3600) / 60));
	var seconds = pad(totalSeconds % 60);

	var timeString = hours + ":" + minutes + ":" + seconds;

	timer.innerHTML = timeString; // Update the timer display
}

// Function to pad a number with leading zeros if necessary
function pad(val) {
	var valString = val + ""; // Convert the input number to a string

	// check if the string is less than 2 characters
	if (valString.length < 2) {
		return "0" + valString; // Add a 0 to the front of the string if it is less than 2 characters
	} else {
		return valString; // Return the string if it is 2 characters or more
	}
}
