import { loadNavbar } from "./navbar-loader.js";

const goTo = (url) => (window.location.href = url);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadNavbar("navbar-placeholder");
    setupNavbarListeners();
  } catch (error) {
    console.error("Errore Navbar:", error);
  }
  setupPageListeners();
});

function setupNavbarListeners() {
  const loginBtn = document.getElementById("btn-login");
  const signUpBtn = document.getElementById("btn-signup");
  const menuToggle = document.getElementById("menu-toggle");

  const menuContent = document.getElementById('navbar-content');
  const menuIconContainer = document.querySelector('.menu-toggle-container');

  if (menuToggle) {
    menuToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        // Aggiungi la classe per far entrare il menu (slide in)
        menuContent.classList.add('open');
      } else {
        // Rimuovi la classe per farlo uscire (slide out)
        menuContent.classList.remove('open');
      }
    });
  }

  // Gestione click fuori per chiudere
  document.addEventListener('click', (e) => {
    if (menuToggle && menuToggle.checked) {
      // Se clicco fuori dal menu E fuori dall'icona
      if (!menuContent.contains(e.target) && !menuIconContainer.contains(e.target)) {
        menuToggle.checked = false;
        // Scatena l'evento change per far partire l'animazione di chiusura (l'else qui sopra)
        menuToggle.dispatchEvent(new Event('change'));
      }
    }
  });

  if (loginBtn) loginBtn.addEventListener("click", () => goTo("login.html"));
  if (signUpBtn) signUpBtn.addEventListener("click", () => goTo("signup.html"));
}

function setupPageListeners() {
  const apriBtn = document.getElementById("btnCreazioneGruppo");
  const chiudiBtn = document.getElementById("btnChiudi");
  const overlay = document.getElementById("formCreazioneGruppo");
  const logoForm = document.getElementById("logoForm");

  if (apriBtn)
    apriBtn.addEventListener("click", () => overlay.classList.remove("hidden"));
  if (chiudiBtn)
    chiudiBtn.addEventListener("click", () => overlay.classList.add("hidden"));
  if (logoForm) logoForm.addEventListener("click", () => goTo("index.html"));
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.add("hidden");
    });
  }
}
