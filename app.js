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

const logoutBtn = document.querySelector("#logout-Btn");

const balanceAmount = document.querySelector("#balanceAmount");
const incomeAmount = document.querySelector("#incomeAmount");
const expenseAmount = document.querySelector("#expenseAmount");
const savingAmount = document.querySelector("#savingAmount");

let chart;

// Theme toggle feature...!
const theme = document.querySelector("#theme");
const Icon = document.querySelector("#icon");

// Page load hone par theme apply karo
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  Icon.classList.replace("fa-moon", "fa-sun");
} else {
  document.body.classList.remove("dark");
  Icon.classList.replace("fa-sun", "fa-moon");
}

theme.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    Icon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    Icon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  }
});

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
  loginForm.reset();
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
  showUserName();
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

  loginForm.reset();
  showRegister();
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

logoutBtn.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  openDashboard();
});

function showUserName() {
  const userName = document.querySelector("#userName");
  const userAvatar = document.querySelector("#userAvatar");

  userName.textContent = user.username;
  userAvatar.textContent = user.username.slice(0, 2).toUpperCase();
}
showUserName();

// State
let activePage = "dashboard";

// Render Function
function render() {
  document
    .querySelector("#dashboard")
    .classList.toggle("active", activePage === "dashboard");
  document
    .querySelector("#settings")
    .classList.toggle("active", activePage === "settings");
  document
    .querySelector("#theme")
    .classList.toggle("active", activePage === "theme");
  document
    .querySelector("#profile")
    .classList.toggle("active", activePage === "profile");
}
function navBtnUpdate(page) {
  activePage = page;
  render();
}
render();

const addTransaction = document.querySelector("#addTransaction");
const transactionModal = document.querySelector("#transactionModal");
const closeModal = document.querySelector("#closeModal");

// Open Modal
addTransaction.addEventListener("click", () => {
  transactionModal.classList.remove("hidden");
});

// Close Modal
closeModal.addEventListener("click", () => {
  transactionModal.classList.add("hidden");
});

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const transactionForm = document.querySelector("#transactionForm");
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);
  const type = document.querySelector("#type").value;
  const category = document.querySelector("#category").value;
  const description = document.querySelector("#description").value.trim();
  const amount = Number(document.querySelector("#amount").value);
  const date = document.querySelector("#date").value;

  if (
    type === "" ||
    category === "" ||
    description === "" ||
    amount === "" ||
    date === ""
  ) {
    alert("Please  fill all feaild");
    return;
  }
  const transaction = {
    id: Date.now(),
    type,
    category,
    description,
    amount,
    date,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  transactionForm.reset();
  transactionModal.classList.add("hidden");
  renderTransactions();
});

const transactionBody = document.querySelector("#transactionBody");
const emptyState = document.querySelector("#emptyState");

function renderTransactions() {
  transactionBody.innerHTML = "";

  if (transactions.length === 0) {
    transactionBody.innerHTML = `
      <tr>
        <td colspan="6">No transactions found.</td>
      </tr>
    `;
    return;
  }

  transactions.forEach((transaction) => {
    const typeText =
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.description}</td>
      <td>${transaction.category}</td>
      <td class="${transaction.type}">
        ${typeText}
      </td>
      <td class="${transaction.type}">
        ${
          transaction.type === "income" ? "+" : "-"
        } <span class="currency">₹</span>${transaction.amount.toLocaleString("en-IN")}
      </td>

      <td>
        <button onclick="delTransaction('${transaction.id}')"
          class="delete-btn"
          data-id="${transaction.id}"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    transactionBody.append(tr);
  });
  amountDashBoard();
}
renderTransactions();

function amountDashBoard() {
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalBalance =
    totalIncome > totalExpense
      ? totalIncome + totalExpense
      : totalIncome - totalExpense;
  const savings = totalBalance > 0 ? totalIncome - totalExpense : 0;

  balanceAmount.textContent = ` ${totalBalance}`;
  incomeAmount.textContent = `${totalIncome}`;
  expenseAmount.textContent = `${totalExpense}`;
  savingAmount.textContent = `${savings}`;
  renderChart();
}
amountDashBoard();

function renderChart() {
  const ctx = document.getElementById("expenseChart");

  if (chart) {
    chart.destroy();
  }

  const income = Number(incomeAmount.textContent);
  const expense = Number(expenseAmount.textContent);

  console.log(expense);
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Income",
          data: [income, 0],
          backgroundColor: "green",
        },
        {
          label: "Expense",
          data: [0, expense],
          backgroundColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
renderChart();

function delTransaction(id) {
  const index = transactions.findIndex(
    (transaction) => transaction.id === Number(id),
  );
  const yes = confirm("can you delete the transaction ");
  if (!yes) return;

  if (index !== -1) {
    transactions.splice(index, 1);
    renderTransactions();

    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
}

