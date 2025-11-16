const NAVBAR_URL = '../src/_navbar.html'; 
/**  
 * @param {string} placeholderId
 */
export function loadNavbar(placeholderId) {
  return fetch(NAVBAR_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore nel caricare ${NAVBAR_URL}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((data) => {
      const element = document.getElementById(placeholderId);
      if (element) {
        element.innerHTML = data;
      } else {
        console.error(`Errore: Elemento con ID "${placeholderId}" non trovato.`);
      }
    })
    .catch((error) => {
      console.error('Impossibile caricare la navbar:', error);
    });
}