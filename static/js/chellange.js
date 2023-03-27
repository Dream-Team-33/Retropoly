// const startButton = document.getElementById("openMyPopup"); // disabled the start button and will now be ran from the dashboard.js file specifically the rollDice function
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const closeButton = document.getElementById("closePopup");


// Define the questions array
const questions = [
  {
    question: "How does an agile team promote customer engagement?",
    answers: [
      { text: "a. With regular communication between the customer and team.", correct: true },
      { text: "b. With incentives and kickbacks for approving completed features.", correct: false },
      { text: "c. With a defect information radiator showing customer meeting absences. ", correct: false},
      { text:"d. With bi-weekly communication between the customer and team.", correct: false},
    ],
  },
  {
    question: "Which role is the owner of the Sprint Backlog?",
    answers: [
      { text: "a. Scrum Master", correct: false },
      { text: "b. Team Leader Media", correct: true },
      { text: "c. Product Owner ", correct: false },
      { text: "d. Development Team", correct: false },
    ],
  },
  {
    question: "When is extending an iteration deadline okay?",
    answers: [
      { text: "a. Only during holidays", correct: false },
      { text: "b. Never", correct: true },
      { text: "c. It can happen any time", correct: false },
      { text: "d. Only when mission-critical stories cannot be completed in the original sprint length", correct: false },
    ],
  },
  {
    question: "Which role is the owner of the Product Backlog? ",
    answers: [
      { text: "a. Customer", correct: false },
      { text: "b. Product Owner", correct: true },
      { text: "c. Scrum Master ", correct: false },
      { text: "d. Development Team", correct: false },
    ],
  }
];

// Function to shuffle the questions array
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Function to display a random question and its answer options
function displayQuestion() {
  // Choose a random question
  const randomQuestion = questions.pop();

  // Display the question text
  questionElement.innerText = randomQuestion.question;

  // Remove any existing answer buttons
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }

  // Create a button for each answer option
  randomQuestion.answers.forEach(answer => {
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

// Function to handle selecting an answer via promises and async/await
function selectAnswer() {
  // will return a promise that resolves with the correct value when the user clicks an answer
  // essentially, this function will wait for the user to click an answer before continuing allowing us to set the number of dice used in the rollDice function in the dashboard.js file
  return new Promise((resolve, reject) => {
    // get all the buttons that are children of the answerButtonsElement
    const buttons = Array.from(answerButtonsElement.children);
    // loop through each button and add an event listener to it
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        //sets the selected button to be the button just clicked by the user
        const selectedButton = button;
        // sets the var "correct" to be whatever the value of the dataset is for the selected button (can be "true" or "undefined")
        const correct = selectedButton.dataset.correct;
        // sets the buttons to reflect whether they are a correct or incorrect answer
        setStatusClass(document.body, correct);
        buttons.forEach(button => {
          setStatusClass(button, button.dataset.correct);
        });
        // resolves the promise with the value of the correct variable
        resolve(correct);
      });
    });
  });
}

// Function to set the status class for an element
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

// Function to clear the status class for an element
function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

// Event listener for the Start button
// startButton.addEventListener("click", () => { // prevented the function looking for the start button to be pressed and will now be ran via a function call in the dashboard.js file
function startQuiz() {
  shuffleQuestions();
  displayQuestion();
  questionContainerElement.classList.remove("hide");
};

// Event listener for the Close button
closeButton.addEventListener("click", () => {
  questionContainerElement.classList.add("hide");
});