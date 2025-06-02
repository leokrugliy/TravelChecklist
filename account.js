const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

// Функція для показу повідомлення, що користувач увійшов
function showLoggedInMessage(email) {
  // Ховаємо вкладки і форми
  document.querySelector(".tabs").style.display = "none";
  loginForm.style.display = "none";
  signupForm.style.display = "none";

  // Створюємо повідомлення і кнопку Вийти
  const container = document.createElement("div");
  container.innerHTML = `
    <p>You are already logged in: <strong>${email}</strong></p>
    <button id="logout-btn" class="btn">Log out </button>
  `;

  // Вставляємо контейнер після header, наприклад, перед main
  const main = document.querySelector("main.account-main");
  main.innerHTML = "";  // очищаємо вміст main
  main.appendChild(container);

  // Обробник кнопки Вийти
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  });
}

// Перевірка, чи користувач увійшов
function checkLoggedIn() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    showLoggedInMessage(loggedInUser.email);
  } else {
    // Показуємо Login форму, приховуємо Sign Up
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    document.querySelector(".tabs").style.display = "flex";
  }
}

// Вкладки Login/Sign Up
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.style.display = "block";
  signupForm.style.display = "none";
});

tabSignup.addEventListener("click", () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  signupForm.style.display = "block";
  loginForm.style.display = "none";
});

// Логін
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Incorrect email or password");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify({ email: user.email }));

  checkLoggedIn();
});

// Реєстрація
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert("Fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.email === email)) {
    alert("A user with this email already exists.");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful! Now log in to your account.");
  tabLogin.click();
});

// Перевірка при завантаженні сторінки
checkLoggedIn();

