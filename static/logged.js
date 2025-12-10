const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
document.getElementById("testo").innerHTML = "Nome utente : " + loggedUser.username+ "<br>Mail : " + loggedUser.mail;