// main.js

document.addEventListener("DOMContentLoaded", () => {
  const tripTypeSelect = document.getElementById("trip-type");
  const createListBtn = document.getElementById("create-list");
  const packingList = document.getElementById("packing-list");

  const customItemInput = document.getElementById("custom-item");
  const addItemBtn = document.getElementById("add-item");

  const countryInput = document.getElementById("country-input");
  const addCountryBtn = document.getElementById("add-country");

  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  // Всього країн для прогресу
  const TOTAL_COUNTRIES = 195;

  // Зберігаємо список країн і речей у пам'яті
  let visitedCountries = new Set();
  let currentPackingItems = [];

  // Речі за типом подорожі
  const packingItemsByTrip = {
    car: ["Driver's license", "Car keys", "Map", "Snacks", "Water bottle"],
    plane: ["Passport", "Boarding pass", "Travel pillow", "Headphones", "Charger"],
    hiking: ["Backpack", "Hiking boots", "Water bottle", "Map", "First aid kit"],
    bike: ["Helmet", "Bike lock", "Gloves", "Water bottle", "Repair kit"],
  };

  // Ініціалізуємо карту Leaflet
  const map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 5,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Для маркерів країн зберігаємо посилання, щоб не дублювати
  const countryMarkers = [];

  // Функція оновлення прогресу
  function updateProgress() {
    const count = visitedCountries.size;
    const percent = Math.min((count / TOTAL_COUNTRIES) * 100, 100);
    progressBar.style.width = percent + "%";
    progressText.textContent = `${count} / ${TOTAL_COUNTRIES} countries visited (${percent.toFixed(1)}%)`;
  }

  // Функція додає маркер на карту по назві країни
  // Для простоти використовуємо API https://nominatim.openstreetmap.org/search?format=json&q=CountryName
  async function addCountryMarker(countryName) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const marker = L.marker([lat, lon]).addTo(map).bindPopup(display_name);
        countryMarkers.push(marker);
      } else {
        alert("Country not found on map.");
      }
    } catch (error) {
      alert("Error fetching location data.");
    }
  }

  // Оновити список речей у DOM
  function renderPackingList() {
    packingList.innerHTML = "";
    currentPackingItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      packingList.appendChild(li);
    });
  }

  // Обробник кнопки "Create List"
  createListBtn.addEventListener("click", () => {
    const tripType = tripTypeSelect.value;
    if (!tripType) {
      alert("Please select a trip type first.");
      return;
    }
    currentPackingItems = [...packingItemsByTrip[tripType]];
    renderPackingList();
  });

  // Обробник додавання власного пункту
  addItemBtn.addEventListener("click", () => {
    const item = customItemInput.value.trim();
    if (item === "") {
      alert("Please enter an item.");
      return;
    }
    if (!currentPackingItems.includes(item)) {
      currentPackingItems.push(item);
      renderPackingList();
    }
    customItemInput.value = "";
  });

  // Обробник додавання країни
  addCountryBtn.addEventListener("click", async () => {
    const country = countryInput.value.trim();
    if (country === "") {
      alert("Please enter a country name.");
      return;
    }
    if (!visitedCountries.has(country.toLowerCase())) {
      visitedCountries.add(country.toLowerCase());
      updateProgress();
      await addCountryMarker(country);
    } else {
      alert("Country already added.");
    }
    countryInput.value = "";
  });

  // Ініціалізуємо порожній прогрес і список
  updateProgress();
  renderPackingList();
});
