//Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var closeBtn = document.getElementById("close-btn");

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
    modal.style.display = "none";
    window.location.assign("#/user");
}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//    if (event.target == modal) {
//        modal.style.display = "none";
//    }
//}

function showModal() {
	modal.style.display = "block";
}

function closeModal() {
	modal.style.display = "none";
}

function modalBtnClick(command) {
	if(command === "close") {
		modal.style.display = "none";
	} else if (command === "search") {
		modal.style.display = "none";
		// TODO: Search for user
	}
}