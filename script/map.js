var map = L.map('mappa').setView([41.8902, 12.4922], 15); // [latitudine, longitudine], zoom

  // 2. AGGIUNTA TILE LAYER (la mappa vera e propria)
  // Questo carica le "piastrelle" (immagini) della mappa da OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);


  // --- ECCO LE FUNZIONI BASE ---

  // FUNZIONE 1: Aggiungere un Marker
  // Aggiunge un segnaposto (pin) sulla mappa
  var marker = L.marker([46.064806, 11.125889]).addTo(map); // Coordinate del Colosseo

  // FUNZIONE 2: Aggiungere un Popup al Marker
  // Un fumetto che appare quando clicchi sul marker
  marker.bindPopup()

  // FUNZIONE 3: Aggiungere una forma (es. un Cerchio)
  var circle = L.circle([41.8919, 12.4903], { // Coordinate di un punto vicino
    color: 'red',       // Colore del bordo
    fillColor: '#f03',  // Colore di riempimento
    fillOpacity: 0.4,   // Opacità del riempimento
    radius: 300         // Raggio in metri
  }).addTo(map);

  // Aggiungiamo un popup anche al cerchio
  circle.bindPopup("Area di interesse.");

  // FUNZIONE 4: Reagire a un clic sulla mappa
  // Questa funzione viene eseguita ogni volta che l'utente clicca sulla mappa
  function onMapClick(e) {
    alert("Hai cliccato sulla mappa alle coordinate: " + e.latlng);
  } 

  map.on('click', onMapClick);