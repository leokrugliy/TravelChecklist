const defaultLists = {
    car: ['Driver license', 'Car charger', 'Map', 'Water bottle'],
    plane: ['Passport', 'Boarding pass', 'Headphones', 'Neck pillow'],
    hiking: ['Backpack', 'Hiking boots', 'Map', 'Water bottle'],
    bike: ['Helmet', 'Bike lock', 'Water bottle', 'Repair kit'],
  };
  
  let userData = {
    tripType: '',
    packingList: []
  };
  
  function loadUserData() {
    const data = localStorage.getItem('userData');
    if (data) {
      userData = JSON.parse(data);
    }
    // Завантажуємо tripType окремо, якщо в userData його нема
    const savedTripType = localStorage.getItem('tripType');
    if (savedTripType && !userData.tripType) {
      userData.tripType = savedTripType;
    }
  }
  
  function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  function renderPackingList() {
    const ul = document.getElementById('packing-list');
    ul.innerHTML = '';
  
    userData.packingList.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
  }
  
  function initPackingList() {
    if (!userData.tripType) {
      alert('Please select a trip type on the main page first!');
      return;
    }
  
    // Якщо список пустий, заповнюємо дефолтним
    if (!userData.packingList || userData.packingList.length === 0) {
      if (defaultLists[userData.tripType]) {
        userData.packingList = [...defaultLists[userData.tripType]];
        saveUserData();
      }
    }
  
    renderPackingList();
  }
  
  function setupAddCustomItem() {
    const input = document.getElementById('custom-item');
    const btnAdd = document.getElementById('add-item');
  
    btnAdd.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) {
        alert('Please enter an item name');
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
  
  function init() {
    loadUserData();
    initPackingList();
    setupAddCustomItem();
  }
  
  init();
  
  