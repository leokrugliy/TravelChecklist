const TOTAL_COUNTRIES = 195;
let geoJsonData = null;

let userData = {
  tripType: '',
  visitedCountries: []
};

async function loadGeoJson() {
  const res = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
  geoJsonData = await res.json();
}

function styleFeature(feature) {
  const countryName = feature.properties.name.toLowerCase();
  const visited = userData.visitedCountries.some(c => c.toLowerCase() === countryName);
  return {
    fillColor: visited ? '#4caf50' : '#ccc',
    weight: 1,
    color: '#444',
    fillOpacity: 0.7
  };
}

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.name);
}

let map, geojsonLayer;

function initMap() {
  map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  geojsonLayer = L.geoJson(geoJsonData, {
    style: styleFeature,
    onEachFeature: onEachFeature
  }).addTo(map);
}

function refreshMap() {
  if (geojsonLayer) {
    geojsonLayer.clearLayers();
    geojsonLayer.addData(geoJsonData);
  }
}

function saveUserData() {
  localStorage.setItem('userData', JSON.stringify(userData));
}

function loadUserData() {
  const data = localStorage.getItem('userData');
  if (data) {
    userData = JSON.parse(data);
  }
}

function setupAddCountry() {
  const input = document.getElementById('country-input');
  const btnAdd = document.getElementById('add-country');
  const ul = document.getElementById('visited-countries-list');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  function renderCountries() {
    ul.innerHTML = '';
    userData.visitedCountries.forEach(country => {
      const li = document.createElement('li');
      li.textContent = country;
      ul.appendChild(li);
    });

    const percent = (userData.visitedCountries.length / TOTAL_COUNTRIES) * 100;
    progressBar.style.width = percent + '%';
    progressText.textContent = `Visited countries: ${userData.visitedCountries.length} / ${TOTAL_COUNTRIES} (${percent.toFixed(1)}%)`;
  }

  btnAdd.addEventListener('click', () => {
    const country = input.value.trim();
    if (!country) {
      alert('Please enter a country name');
      return;
    }
    if (userData.visitedCountries.find(c => c.toLowerCase() === country.toLowerCase())) {
      alert('Country already added');
      return;
    }
    userData.visitedCountries.push(country);
    saveUserData();
    renderCountries();
    refreshMap();
    input.value = '';
  });

  renderCountries();
}

async function init() {
  await loadGeoJson();
  loadUserData();
  initMap();
  refreshMap();
  setupAddCountry();
}

init();
