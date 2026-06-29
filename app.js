const authContainer = document.querySelector(".auth-container");
const loginCard = document.querySelector(".login-card");
const registerCard = document.querySelector(".register-card");
const app = document.querySelector(".app");

const sign_up = document.querySelector("#sign_up");
const login = document.querySelector("#Login");

const registerForm = document.querySelector("#registerForm");
const registerUsername = document.querySelector("#registerUsername");
const registerPassword = document.querySelector("#registerPassword");

const loginForm = document.querySelector("#loginForm");
const loginUsername = document.querySelector("#loginUsername");
const loginPassword = document.querySelector("#loginPassword");

const logOut = document.querySelector("#logOut");

function showLogin() {
  loginCard.classList.remove("hidden");
  registerCard.classList.add("hidden");
}

function showRegister() {
  loginCard.classList.add("hidden");
  registerCard.classList.remove("hidden");
}
login.addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});

sign_up.addEventListener("click", (e) => {
  e.preventDefault();
  showRegister();
});

function openDashboard() {
  authContainer.classList.add("hidden");
  app.classList.remove("hidden");
}

function logout() {
  app.classList.add("hidden");
  authContainer.classList.remove("hidden");
  showLogin();
}

// Registration

let user = JSON.parse(localStorage.getItem("user"));

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = registerUsername.value.trim();
  const password = registerPassword.value.trim();

  if (username === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }
  if (user !== null) {
    if (user["username"] === username) {
      alert("Username already exists. Please choose another username.");
      return;
    }
  }

  user = {
    username,
    password,
  };

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("currentUser", username);
  alert("Account created successfully!");

  registerForm.reset();
  registerCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
});

//login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  if (username === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }

  if (!user) {
    alert("No account found. Please register first.");
    return;
  }

  if (username === user["username"] && password === user["password"]) {
    alert("login successful");
    localStorage.setItem("isLoggedIn", "true");

    authContainer.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    alert("login faild");
  }
});

function openDashboard() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    authContainer.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    authContainer.classList.remove("hidden");
    app.classList.add("hidden");
  }
}
openDashboard();

logOut.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  openDashboard();
});
