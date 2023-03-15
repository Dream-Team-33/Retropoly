function openPopup(popup) {
	/* Open popup and make accessible screen readers */


	//Looks for an id with the value of what is passed by the function call on the dashboard.html file
	var specifiedPopup = document.getElementById(popup) 
	//assigns the display style "none" to hide the popup from the user
	specifiedPopup.style.display = "block"

	/* IGNORE Requires JQUERY AND WE DONT HAVE IT INTSALLED CURRENTLY
	$(popup).show().attr("aria-hidden", "false");
	Focus on element to guide screen readers to popup
	$("#closePopup").focus();*/
}

function closePopup(popup) {
	/* Close popup and hide from screen readers */


	//Looks for an id with the value of what is passed by the function call on the dashboard.html file
	var specifiedPopup = document.getElementById(popup)
	//assigns the display style "none" to hide the popup from the user
	specifiedPopup.style.display = "none"


	/*
	///IGNORE Requires JQUERY AND WE DONT HAVE IT INTSALLED CURRENTLY
	$(popup).hide().attr("aria-hidden", "true");
	Focus screen readers back to button 
	$("#openMyPopup").focus();
	*/
}


