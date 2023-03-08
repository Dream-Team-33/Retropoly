function openPopup(popup) {
	/* Open popup and make accessible screen readers */
	$(popup).show().attr("aria-hidden", "false");
	/* Focus on element to guide screen readers to popup */
	$("#closePopup").focus();
}

function closePopup(popup) {
	/* Close popup and hide from screen readers */
	$(popup).hide().attr("aria-hidden", "true");
	/* Focus screen readers back to button */
	$("#openMyPopup").focus();
}