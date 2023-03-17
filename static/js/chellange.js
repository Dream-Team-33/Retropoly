const startButton = document.getElementById("openMyPopup");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const closeButton = document.getElementById("closePopup");

let shuffledQuestions, currentQuestionIndex;
let countdown; // stores the countdown timer interval

startButton.addEventListener("click", startGame);
closeButton.addEventListener("click", closePopup);

function startGame() {
	startButton.classList.add("hide");
	questionContainerElement.classList.remove("hide");
	shuffledQuestions = questions.sort(() => Math.random() - 0.5);
	currentQuestionIndex = 0;
	showQuestion(shuffledQuestions[currentQuestionIndex]);
	countdown = startCountdown(10); // 10 seconds timer
}

function showQuestion(question) {
	questionElement.innerText = question.question;
	while (answerButtonsElement.firstChild) {
		answerButtonsElement.removeChild(answerButtonsElement.firstChild);
	}
	question.answers.forEach((answer) => {
		const button = document.createElement("button");
		button.innerText = answer.text;
		button.classList.add("btn");
		if (answer.correct) {
			button.dataset.correct = answer.correct;
		}
		button.addEventListener("click", selectAnswer);
		answerButtonsElement.appendChild(button);
	});
}

function selectAnswer(e) {
	clearInterval(countdown);
	const selectedButton = e.target;
	const correct = selectedButton.dataset.correct;
	setStatusClass(document.body, correct);
	Array.from(answerButtonsElement.children).forEach((button) => {
		setStatusClass(button, button.dataset.correct);
	});
	if (shuffledQuestions.length > currentQuestionIndex + 1) {
		currentQuestionIndex++;
		showQuestion(shuffledQuestions[currentQuestionIndex]);
		countdown = startCountdown(10); // reset timer for next question
	} else {
		startButton.innerText = "Restart";
		startButton.classList.remove("hide");
	}
}

function setStatusClass(element, correct) {
	clearStatusClass(element);
	if (correct) {
		element.classList.add("correct");
	} else {
		element.classList.add("wrong");
	}
}

function clearStatusClass(element) {
	element.classList.remove("correct");
	element.classList.remove("wrong");
}

function startCountdown(seconds) {
	const timerElement = document.getElementById("timer");
	let remainingSeconds = seconds;
	timerElement.innerText = `${remainingSeconds} seconds`;
	const countdown = setInterval(() => {
		remainingSeconds--;
		timerElement.innerText = `${remainingSeconds} seconds`;
		if (remainingSeconds <= 0) {
			clearInterval(countdown);
			selectAnswer({ target: answerButtonsElement }); // automatically select wrong answer
		}
	}, 1000);
	return countdown;
}

function closePopup(popupId) {
	const popupElement = document.getElementById(popupId);
	popupElement.setAttribute("aria-hidden", "true");
	popupElement.removeEventListener("click", closePopup);
	startButton.removeEventListener("click", startGame);
	closeButton.removeEventListener("click", closePopup);
}

const questions = [
	{
		question: "What is 2 + 2?",
		answers: [
			{ text: "4", correct: true },
			{ text: "22", correct: false },
		],
	},
	{
		question: "Who is the best YouTuber?",
		answers: [
			{ text: "Web Dev Simplified", correct: true },
			{ text: "Traversy Media", correct: true },
			{ text: "Dev Ed", correct: true },
			{ text: "Fun Fun Function", correct: true },
		],
	},
	{
		question: "Is web development fun?",
		answers: [
			{ text: "Kinda", correct: false },
			{ text: "YES!!!", correct: true },
			{ text: "Um no", correct: false },
			{ text: "IDK", correct: false },
		],
	},
	{
		question: "What is 4 * 2?",
		answers: [
			{ text: "6", correct: false },
			{ text: "8", correct: true },
		],
	},
];
