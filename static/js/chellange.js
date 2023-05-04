// const startButton = document.getElementById("openMyPopup"); // disabled the start button and will now be ran from the dashboard.js file specifically the rollDice function
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const closeButton = document.getElementById("closePopup");


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


// Define the questions array
const questions = [
  {
    question: "How does an agile team promote customer engagement?",
    answers: [
      { text: "a. With regular communication between the customer and team.", correct: true },
      { text: "b. With incentives and kickbacks for approving completed features.", correct: false },
      { text: "c. With a defect information radiator showing customer meeting absences. ", correct: false },
      { text: "d. With bi-weekly communication between the customer and team.", correct: false },
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
  },
  {
    question: "What is the purpose of a Kanban board?",
    answers: [
      { text: "a. To visually represent the progress of a project", correct: true },
      { text: "b. To assign tasks to team members", correct: false },
      { text: "c. To track individual work hours", correct: false },
      { text: "d. To create a project timeline", correct: false },
    ],
  },
  {
    question: "What is the difference between a Scrum board and a Kanban board?",
    answers: [
      { text: "a. A Scrum board is used for planning, while a Kanban board is used for tracking progress", correct: false },
      { text: "b. A Scrum board has predefined stages, while a Kanban board can be customized", correct: true },
      { text: "c. A Scrum board is limited to software development projects, while a Kanban board can be used for any project", correct: false },
      { text: "d. A Scrum board is more effective than a Kanban board", correct: false },
    ],
  },
  {
    question: "What is the purpose of the 'To Do' column on a Kanban board?",
    answers: [
      { text: "a. To indicate work that is currently in progress", correct: false },
      { text: "b. To indicate work that has been completed", correct: false },
      { text: "c. To indicate work that has not yet started", correct: true },
      { text: "d. To indicate work that has been put on hold", correct: false },
    ],
  },
  {
    question: "What is the purpose of a backlog?",
    answers: [
      { text: "a. To store completed work items", correct: false },
      { text: "b. To store work items that have not yet been started", correct: true },
      { text: "c. To store work items that are currently in progress", correct: false },
      { text: "d. To store work items that have been put on hold", correct: false },
    ],
  },
  {
    question: "What is a user story?",
    answers: [
      { text: "a. A brief description of a feature or requirement from the user's perspective", correct: true },
      { text: "b. A list of tasks to complete a project", correct: false },
      { text: "c. A summary of the project's budget", correct: false },
      { text: "d. A list of potential risks for a project", correct: false },
    ],
  },
  {
    question: "What is the purpose of the 'Done' column on a Kanban board?",
    answers: [
      { text: "a. To indicate work that has been completed", correct: true },
      { text: "b. To indicate work that is currently in progress", correct: false },
      { text: "c. To indicate work that has not yet started", correct: false },
      { text: "d. To indicate work that has been put on hold", correct: false },
    ],
  },
  {
    question: "What is the purpose of a daily stand-up meeting?",
    answers: [
      { text: "a. To review the budget for the project ", correct: false },
      { text: "b. To assign tasks for the day", correct: false },
      { text: "c. To present completed work to stakeholders", correct: false },
      { text: "d. To discuss progress and obstacles with the team", correct: true },
    ],
  },
  {
    question: "What is a sprint in Scrum methodology?",
    answers: [
      { text: "a. A period of time for planning and preparing for the project", correct: false },
      { text: "b. A period of time for executing and completing the project", correct: true },
      { text: "c. A period of time for reviewing and evaluating the project", correct: false },
      { text: "d. A period of time for maintenance and bug fixing", correct: false },
    ],
  },
  {
    question: "What is the purpose of a burndown chart?",
    answers: [
      { text: "a. To track the progress of the team during a sprint", correct: true },
      { text: "b. To assign tasks to team members", correct: false },
      { text: "c. To track the hours worked by individual team members", correct: false },
      { text: "d. To estimate the time required to complete the project", correct: false },
    ],
  },
  {
    question: "What is the purpose of a retrospective meeting?",
    answers: [
      { text: "a. To review the progress of the project", correct: false },
      { text: "b. To review and improve the team's processes", correct: true },
      { text: "c. To assign tasks for the next sprint", correct: false },
      { text: "d. To discuss the project with stakeholders", correct: false },
    ],
  },
  {
    question: "What is the role of a Product Owner in Scrum methodology?",
    answers: [
      { text: "a. To manage the team and assign tasks", correct: false },
      { text: "b. To review and approve completed work items", correct: false },
      { text: "c. To develop and test the product", correct: false },
      { text: "d. To represent the interests of the stakeholders", correct: true },
    ],
  },
  {
    question: "What is the role of a Scrum Master in Scrum methodology?",
    answers: [
      { text: "a. To manage the team and assign tasks", correct: false },
      { text: "b. To represent the interests of the stakeholders", correct: false },
      { text: "c. To develop and test the product", correct: false },
      { text: "d. To facilitate the Scrum process and ensure its proper implementation", correct: true },
    ],
  },
  {
    question: "What is the purpose of a 'Definition of Done' in Scrum methodology?",
    answers: [
      { text: "a. To define the scope of the project", correct: false },
      { text: "b. To define the acceptance criteria for completed work items", correct: true },
      { text: "c. To define the roles and responsibilities of the team members", correct: false },
      { text: "d. To define the timeline for the project", correct: false },
    ],
  },
  {
    question: "What is a retrospective board?",
    answers: [
      { text: "a. A board used for tracking the progress of the project", correct: false },
      { text: "b. A board used for brainstorming ideas for improvement", correct: true },
      { text: "c. A board used for assigning tasks to team members", correct: false },
      { text: "d. A board used for visualizing the project timeline", correct: false },
    ],
  },
  {
    question: "When are requirements completed in iterative projects?",
    answers: [
      { text: "a. Once the product owner says so", correct: false },
      { text: "b. When the project is completed", correct: false },
      { text: "c. Once the code is written for the story", correct: false },
      { text: "d. They're never completed", correct: true },
    ],
  },
  {
    question: "Scrum values people and interactions over... ",
    answers: [
      { text: "a. Contract negotiation ", correct: false },
      { text: "b. Projects and tools", correct: false },
      { text: "c. Working tools", correct: false },
      { text: "d. Processes and tools", correct: true },
    ],
  }
];