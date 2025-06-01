// Список країн (можна додати більше)
const countries = [
    "USA",
    "Canada",
    "France",
    "Germany",
    "Japan",
    "Australia",
    "Brazil",
    "Ukraine",
    "India",
    "South Africa"
  ];
  
  // Функція створення списку країн з чекбоксами
  function renderCountries() {
    const container = document.getElementById("countriesList");
    container.innerHTML = "";
  
    countries.forEach((country, index) => {
      const div = document.createElement("div");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = country-${index};
  
      // Збереження стану в localStorage
      checkbox.checked = localStorage.getItem(`visited-${country}`) === "true";
  
      checkbox.addEventListener("change", () => {
        localStorage.setItem(`visited-${country}`, checkbox.checked);
        updateVisitedStats();
      });
  
      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = country;
  
      div.appendChild(checkbox);
      div.appendChild(label);
  
      container.appendChild(div);
    });
  
    document.getElementById("totalCountries").textContent = countries.length;
    updateVisitedStats();
  }
  
  // Функція оновлення статистики
  function updateVisitedStats() {
    const visited = countries.filter(country => localStorage.getItem(`visited-${country}`) === "true").length;
    const total = countries.length;
    const percent = total === 0 ? 0 : Math.round((visited / total) * 100);
  
    document.getElementById("visitedCount").textContent = visited;
    document.getElementById("visitedPercent").textContent = percent + "%";
  }
  
  // Кнопка очищення вибору країн
  document.getElementById("clearCountries").addEventListener("click", () => {
    countries.forEach(country => localStorage.removeItem(`visited-${country}`));
    renderCountries();
  });
  
  // Ініціалізація списку країн при завантаженні
  renderCountries();
  
const packingLists = {
    flight: [
      "Passport",
      "Flight tickets",
      "Travel insurance",
      "Change of clothes",
      "Toiletries",
      "Phone charger",
      "Headphones"
    ],
    roadtrip: [
      "Driver's license",
      "Car documents",
      "Snacks and drinks",
      "Map or GPS device",
      "First aid kit",
      "Spare tire",
      "Sunglasses"
    ],
    hiking: [
      "Backpack",
      "Water bottle",
      "Hiking boots",
      "Map and compass",
      "Weather-appropriate clothing",
      "Snacks",
      "First aid kit"
    ],
    withKids: [
      "Diapers",
      "Baby wipes",
      "Toys",
      "Snacks",
      "Extra clothes",
      "Stroller",
      "Child ID"
    ]
  };
  
  // Елементи на сторінці
  const tripTypeSelect = document.getElementById("tripType");
  const listContainer = document.getElementById("packingList");
  const clearBtn = document.getElementById("clearChecklist");
  
  // Функція для оновлення списку речей
  function updatePackingList() {
    const selectedTrip = tripTypeSelect.value;
    const items = packingLists[selectedTrip] || [];
  
    // Очищаємо поточний список
    listContainer.innerHTML = "";
  
    // Створюємо нові пункти зі чекбоксами
    items.forEach(item => {
      const li = document.createElement("li");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = item-${item};
      
      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = item;
  
      li.appendChild(checkbox);
      li.appendChild(label);
      listContainer.appendChild(li);
    });
  }
  
  // Функція для очищення всіх чекбоксів
  function clearChecklist() {
    const checkboxes = listContainer.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(cb => cb.checked = false);
  }
  
  // Обробник зміни вибору типу поїздки
  tripTypeSelect.addEventListener("change", updatePackingList);
  
  // Обробник кнопки очищення
  clearBtn.addEventListener("click", clearChecklist);
  
  // Ініціалізуємо список при завантаженні сторінки
  updatePackingList();