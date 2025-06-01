// main.js

let allCountries = [];       // Масив усіх назв країн (нижній регістр)
let geoJsonData = null;      // GeoJSON для карти
const TOTAL_COUNTRIES = 195; // Загальна кількість країн (для прогресу)

const defaultLists = {
  car: ['Driver license', 'Car charger', 'Map', 'Water bottle'],
  plane: ['Passport', 'Boarding pass', 'Headphones', 'Neck pillow'],
  hiking: ['Backpack', 'Hiking boots', 'Map', 'Water bottle'],
  bike: ['Helmet', 'Bike lock', 'Water bottle', 'Repair kit'],
};

let userData = {
  tripType: '',
  packingList: [],
  visitedCountries: []
};

// --- Збереження / Завантаження ---
function saveUserData() {
  localStorage.setItem('userData', JSON.stringify(userData));
}

function loadUserData() {
  const data = localStorage.getItem('userData');
  if (data) {
    userData = JSON.parse(data);
  }
}

// --- Функції відмалювання ---
function renderPackingList() {
  const ul = document.getElementById('packing-list');
  ul.innerHTML = '';
  userData.packingList.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderVisitedCountries() {
  const ul = document.getElementById('packing-list'); // якщо хочеш окремий список для країн — створи інший ul
  // Але щоб не плутати, зробимо окремий список для країн
  // Припустимо, додай <ul id="visited-countries-list"></ul> в HTML
  const visitedUl = document.getElementById('visited-countries-list');
  if (!visitedUl) return; // якщо такого немає - пропускаємо
  visitedUl.innerHTML = '';
  userData.visitedCountries.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    visitedUl.appendChild(li);
  });
}

function updateVisitedCountriesProgress() {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const count = userData.visitedCountries.length;
  const percent = Math.round((count / TOTAL_COUNTRIES) * 100);

  progressBar.style.width = percent + '%';
  progressText.textContent = `Visited ${count} of ${TOTAL_COUNTRIES} countries (${percent}%)`;
}

// --- Карта Leaflet ---
let map;
let geojsonLayer;

async function loadGeoJson() {
  const res = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
  geoJsonData = await res.json();
  allCountries = geoJsonData.features.map(f => f.properties.name.toLowerCase());
}

function styleFeature(feature) {
  const countryName = feature.properties.name.toLowerCase();
  const isVisited = userData.visitedCountries.some(c => c.toLowerCase() === countryName);

  return {
    fillColor: isVisited ? '#4caf50' : '#ccc',
    weight: 1,
    opacity: 1,
    color: '#444',
    fillOpacity: 0.7
  };
}

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.name);
}

function refreshMap() {
  if (geojsonLayer) {
    geojsonLayer.clearLayers();
    geojsonLayer.addData(geoJsonData);
  }
}

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

// --- Обробники подій ---
function setupTripType() {
  const select = document.getElementById('trip-type');
  const btnCreate = document.getElementById('create-list');

  btnCreate.addEventListener('click', () => {
    const type = select.value;
    if (!type) {
      alert('Please select a trip type');
      return;
    }
    userData.tripType = type;
    userData.packingList = [...defaultLists[type]];
    saveUserData();
    renderPackingList();
  });
}

function setupAddCustomItem() {
  const input = document.getElementById('custom-item');
  const btnAdd = document.getElementById('add-item');

  btnAdd.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) {
      alert('Please enter an item');
      return;
    }
    if (userData.packingList.includes(val)) {
      alert('This item is already in the list');
      return;
    }
    userData.packingList.push(val);
    saveUserData();
    renderPackingList();
    input.value = '';
  });
}

function capitalizeWords(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function setupAddCountry() {
  const input = document.getElementById('country-input');
  const btnAdd = document.getElementById('add-country');

  btnAdd.addEventListener('click', () => {
    const raw = input.value.trim();
    if (!raw) {
      alert('Please enter a country name');
      return;
    }
    const lowerRaw = raw.toLowerCase();

    if (!allCountries.includes(lowerRaw)) {
      alert('Country not found. Please enter a valid country name.');
      return;
    }
    if (userData.visitedCountries.some(c => c.toLowerCase() === lowerRaw)) {
      alert('This country is already in your visited list.');
      return;
    }

    // Додаємо офіційну назву країни з GeoJSON, з великої літери
    const officialNameRaw = geoJsonData.features.find(f => f.properties.name.toLowerCase() === lowerRaw).properties.name;
    const officialName = capitalizeWords(officialNameRaw);

    userData.visitedCountries.push(officialName);
    saveUserData();
    updateVisitedCountriesProgress();
    refreshMap();
    renderVisitedCountries();
    input.value = '';
  });
}

// --- Ініціалізація ---
async function init() {
  await loadGeoJson();
  loadUserData();

  renderPackingList();
  renderVisitedCountries();
  updateVisitedCountriesProgress();

  initMap();
  setupTripType();
  setupAddCustomItem();
  setupAddCountry();
}

init();

