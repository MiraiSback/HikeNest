import { loadNavbar } from "./navbar-loader.js";

function apriLogIn() {
  window.location.href = "login.html";
}
function apriSignUp() {
  window.location.href = "signup.html";
}
function apriHome() {
  window.location.href = "index.html";
}

function apriForm() {
  const overlay = document.getElementById("formCreazioneGruppo");
  if (overlay) overlay.classList.remove("hidden");
}

function chiudiForm() {
  const overlay = document.getElementById("formCreazioneGruppo");
  if (overlay) overlay.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("navbar-placeholder")
    .then(() => {
      console.log("Navbar caricata. Imposto i listener...");

      const loginBtn = document.getElementById("btn-login");
      const signUpBtn = document.getElementById("btn-signup");
      const apriBtn = document.getElementById("btnCreazioneGruppo");
      const chiudiBtn = document.getElementById("btnChiudi");
      const overlay = document.getElementById("formCreazioneGruppo");
      const logoForm = document.getElementById("logoForm");

      if (logoForm) logoForm.addEventListener("click", apriHome);
      if (apriBtn) apriBtn.addEventListener("click", apriForm);
      if (chiudiBtn) chiudiBtn.addEventListener("click", chiudiForm);
      if (loginBtn) loginBtn.addEventListener("click", apriLogIn);
      if (signUpBtn) signUpBtn.addEventListener("click", apriSignUp);

      if (overlay) {
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) {
            chiudiForm();
          }
        });
      }
    })
    .catch((error) => {
      console.error("Fallimento nel caricamento della navbar:", error);
    });
});
