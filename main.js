// Зразок списків речей для різних типів поїздок
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