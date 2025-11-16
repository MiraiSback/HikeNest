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
