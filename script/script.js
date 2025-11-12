document.addEventListener("DOMContentLoaded", function() {

    const apriBtn = document.getElementById("btnCreazioneGruppo");
    const chiudiBtn = document.getElementById("btnChiudi");
    const overlay = document.getElementById("formCreazioneGruppo");

    function apriForm() {
        overlay.classList.remove("hidden");
    }

    function chiudiForm() {
        overlay.classList.add("hidden");
    }

    apriBtn.addEventListener("click", apriForm);
    chiudiBtn.addEventListener("click", chiudiForm);

    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            chiudiForm();
        }
    });

});

function apriLogIn(){
    window.location.href = "login.html";
}
function apriSignUp(){
    window.location.href = "signup.html";
}
function apriHome(){
    window.location.href = "index.html";
}
/*var map = L.map('mappa').setView([46.0669, 11.1167], 12);

//Aggiungi il layer della mappa (da OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//(Opzionale) Aggiungi un marcatore (pin)
var marker = L.marker([46.0656, 11.1267]).addTo(map);

L.Control.Form = L.Control.extend({
    onAdd: function(map) {
        // Prende il tuo div .selezione-percorso dall'HTML
        var form = L.DomUtil.get('form-percorso'); // Dobbiamo dare un ID al tuo div
        return form;
    },
        
    onRemove: function(map) {
        // Niente da fare qui
    }
});

// 9. Crei una funzione per aggiungere il controllo
L.control.form = function(opts) {
    return new L.Control.Form(opts);
}
        
// 10. Aggiungi il tuo controllo alla mappa nell'angolo in alto a destra
L.control.form({ position: 'topright' }).addTo(map);

// 11. (FONDAMENTALE) Impedisce alla mappa di "catturare" i click dentro la form
var formElement = document.getElementById('form-percorso');
L.DomEvent.disableClickPropagation(formElement);*/