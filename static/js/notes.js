/**This is for the lines in the notes*/

//Get all elements with the class "line" and
//store them in a constant variable called lines
const lines = document.querySelectorAll(".line");

//Get the first element with the class "btn" and
//store it in a constant variable called button
const button = document.getElementsByClassName("btn")[0];

//Create a boolean variable called "save" and set it to true
let save = true;

//Define a function called "save" that will be called when the button is clicked
const saveEdit = () => {
	//If the save variable is true, change the
	//button text to "Edit" and set it to false, otherwise set it to true
	if (save) {
		button.innerHTML = "Edit";
		save = false;
	} else {
		button.innerHTML = "Save";
		save = true;
	}

	//Toggle the class button "edit-btn"
	//and call the "lineControls" function
	button.classList.toggle("edit-btn");
	lineControls();
};

//Define a function called "lineControls"
//that will be enabled or disabled depending on the save variabled
const lineControls = () => {
	lines.forEach((line) => {
		if (!save) {
			line.setAttribute("disable", true);
		} else {
			line.setAttribute("disable", false);
		}
	});
};

//Define a function called "setLinesMaxWidth" that
//sets the max-width of each line element based on its width
const setLinesMaxWidth = () => {
	lines.forEach((line) => {
		line.setAttribute("maxlength", line.offsetWidth / 12);
	});
};
//Call the "setLinesMaxWidth" function to set the
//initial max-length of each line element
setLinesMaxWidth();

// Add an event listener to the button that will execute the "saveEdit" function
// when clicked
button.addEventListener("click", saveEdit);

//Add an event listener to the window that will execute the "setLinesMaxWidth" function
//when the window is resized
window.addEventListener("resize", setLinesMaxWidth);
