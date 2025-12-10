var loggedUser = {}

function login(){
    var mail = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    fetch('../api/autenticazione', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify( { mail: mail, password: password } ),
    })  
    .then((resp) => resp.json())
    .then(function(data) { // Here you get the data to modify as you please
        var testo = document.getElementById("testo");
        testo.innerHTML = "<a href= '/miapagina.html'>"+data.username + "</a>";

        localStorage.setItem("loggedUser", JSON.stringify(data));
        
        console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.mail;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        loggedUser.username = data.username;
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        return;
    })

}
