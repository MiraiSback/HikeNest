import { loadNavbar } from "./navbar-loader.js";

const goTo = (url) => window.location.href = url;

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
  if (loginBtn) loginBtn.addEventListener("click", () => goTo("login.html"));
  if (signUpBtn) signUpBtn.addEventListener("click", () => goTo("signup.html"));
}

function setupPageListeners() {
  const apriBtn = document.getElementById("btnCreazioneGruppo");
  const chiudiBtn = document.getElementById("btnChiudi");
  const overlay = document.getElementById("formCreazioneGruppo");
  const logoForm = document.getElementById("logoForm"); 

  if (apriBtn) apriBtn.addEventListener("click", () => overlay.classList.remove("hidden"));
  if (chiudiBtn) chiudiBtn.addEventListener("click", () => overlay.classList.add("hidden"));
  if (logoForm) logoForm.addEventListener("click", () => goTo("index.html"));
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.add("hidden");
    });
  }
}
