let expenseChart, incomeChart;
const chart = document.querySelector(".chart-container");
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const expenseList = currentUser ? JSON.parse(localStorage.getItem(`expense_${currentUser.username}`)) || [] : [];
const incomeList = currentUser ? JSON.parse(localStorage.getItem(`income_${currentUser.username}`)) || [] : [];

renderTable(expenseList, incomeList);

if (expenseList.length > 0) {
  renderExpenseChart();
}

if (incomeList.length > 0) {
  renderIncomeChart();
}
function addExpense() {
  const expenseName = document.querySelector("#expense-name").value;
  const expenseAmount = document.querySelector("#expense-amount").value;

  if(expenseAmount > 2000){
    alert("MAG TIPID KA NAMAN PRE");
  }
  if(expenseAmount > 0){
    alert("Grabe Sobrang Gastos mo na");
  }

  if (expenseName !== "" && expenseAmount !== "" && !isNaN(expenseAmount)) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
    currentUser.balance -= parseInt(expenseAmount);
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); 
    expenseList.push({ name: expenseName, amount: parseInt(expenseAmount) });
    document.querySelector("#expense-name").value = "";
    document.querySelector("#expense-amount").value = "";

    if (currentUser) {
      localStorage.setItem(`expense_${currentUser.username}`, JSON.stringify(expenseList));
    }
    renderTable(expenseList, incomeList);
    renderExpenseChart();

    const users = JSON.parse(localStorage.getItem('users'));
    const userToUpdate = users.find(user => user.username === currentUser.username);
    userToUpdate.balance = currentUser.balance;
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();
  }
}

function addIncome() {
  const incomeName = document.querySelector("#income-name").value;
  const incomeAmount = document.querySelector("#income-amount").value;

  if(incomeAmount < 1000){
    alert("Mag Trabaho ka pa, Sobrang Gastos mo")
  }

  if (incomeName !== "" && incomeAmount !== "" && !isNaN(incomeAmount)) {
    incomeList.push({ name: incomeName, amount: parseInt(incomeAmount) });
    document.querySelector("#income-name").value = "";
    document.querySelector("#income-amount").value = "";
    currentUser.balance += parseInt(incomeAmount);
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); 

    if (currentUser) {
      localStorage.setItem(`income_${currentUser.username}`, JSON.stringify(incomeList));
    }
    renderTable(expenseList, incomeList);

    if (incomeList.length > 0) {
      renderIncomeChart();
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const userToUpdate = users.find(user => user.username === currentUser.username);
    userToUpdate.balance = currentUser.balance;
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();  
  }
}

function renderTable(filteredExpenses = expenseList, filteredIncomes = incomeList) {
 const expensetbody = document.getElementById("expensetablebody");
  expensetbody.innerHTML = "";
  const incometbody = document.getElementById("incometablebody");
  incometbody.innerHTML = "";

  filteredExpenses.forEach((expense, index) => {
    const { name, amount } = expense;
    const expenseTableRow = document.createElement("tr");
    const expenseNumTd = document.createElement("td");
    const expenseNameTd = document.createElement("td");
    const expenseAmountTd = document.createElement("td");
    expenseTableRow.classList.add("bg-gray-800", "border-b");
    expenseNumTd.classList.add("pl-10","py-3");
    expenseNumTd.textContent = index + 1;
    expenseTableRow.appendChild(expenseNumTd);
    expenseNameTd.classList.add("pl-16","w-1/3");
    expenseNameTd.textContent = name;
    expenseTableRow.appendChild(expenseNameTd);
    expenseAmountTd.classList.add( "mr-10", "w-2/3");
    expenseAmountTd.textContent = amount;
    expenseTableRow.appendChild(expenseAmountTd);
    expensetbody.appendChild(expenseTableRow);
  });

  filteredIncomes.forEach((income, index) => {
    const { name, amount } = income;
    const incomeTableRow = document.createElement("tr");
    const incomeNumTd = document.createElement("td");
    const incomeNameTd = document.createElement("td");
    const incomeAmountTd = document.createElement("td");
    incomeTableRow.classList.add("bg-gray-800", "border-b");
    incomeNumTd.classList.add("pl-10","py-3");
    incomeNumTd.textContent = index + 1;
    incomeTableRow.appendChild(incomeNumTd);
    incomeNameTd.classList.add("pl-16","w-1/3");
    incomeNameTd.textContent = name;
    incomeTableRow.appendChild(incomeNameTd);
    incomeAmountTd.classList.add("mr-10", "w-2/3");
    incomeAmountTd.textContent = amount;
    incomeTableRow.appendChild(incomeAmountTd);
    incometbody.appendChild(incomeTableRow);
  });

  saveExpenseListToLocalStorage(filteredExpenses); 
  saveIncomeListToLocalStorage(filteredIncomes); 
}

function renderExpenseChart() {
  const leftSide = document.querySelector(".left-side");
  leftSide.innerHTML = "";

  const ctx = document.getElementById("chart").getContext("2d");
  expenseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: expenseList.map((expense) => expense.name),
      datasets: [
        {
          label: "Expenses",
          data: expenseList.map((expense) => expense.amount),
          backgroundColor: "rgba(255, 107, 107, 1)",
          borderColor: "rgba(255, 107, 107, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  const totalAmount = expenseList.reduce((total, expense) => total + expense.amount, 0);
  const maxExpense = Math.max(...expenseList.map((expense) => expense.amount));
  const totalHeight = (totalAmount / maxExpense) * chart.clientHeight;
}

function renderIncomeChart() {
  const rightSide = document.querySelector(".income-left-side");
  rightSide.innerHTML = "";

  const ctx = document.getElementById("income-chart").getContext("2d");
  incomeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: incomeList.map((income) => income.name),
      datasets: [
        {
          label: "Income",
          data: incomeList.map((income) => income.amount),
          backgroundColor: "rgba(75, 192, 192, 1)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  const totalAmount = incomeList.reduce((total, income) => total + income.amount, 0);
  const maxIncome = Math.max(...incomeList.map((income) => income.amount));
  const totalHeight = (totalAmount / maxIncome) * chart.clientHeight;
}

function saveExpenseListToLocalStorage(expenseList) {
  if (currentUser) {
    localStorage.setItem(`expense_${currentUser.username}`, JSON.stringify(expenseList));
  }
}

function saveIncomeListToLocalStorage(incomeList) {
  if (currentUser) {
    localStorage.setItem(`income_${currentUser.username}`, JSON.stringify(incomeList));
  }
}

function clearLocalStorage() {
  if (currentUser) {
    localStorage.removeItem(`expense_${currentUser.username}`);
    localStorage.removeItem(`income_${currentUser.username}`);
  }
  location.reload();
}

function searchExpenses() {
  const searchInput = document.querySelector("#searchtable");
  const searchTerm = searchInput.value.toLowerCase();
  const filteredExpenses = expenseList.filter((expense) =>
    expense.name.toLowerCase().includes(searchTerm)
  );
  renderTable(filteredExpenses, incomeList);
}

function searchIncome() {
  const searchInput = document.querySelector("#searchtableincome");
  const searchTerm = searchInput.value.toLowerCase();
  const filteredIncomes = incomeList.filter((income) =>
    income.name.toLowerCase().includes(searchTerm)
  );
  renderTable(expenseList, filteredIncomes);
}

const expenseSearchButton = document
  .getElementById("expense-searchtable")
  .nextElementSibling;

const incomeSearchButton = document
  .getElementById("searchtableincome")
  .nextElementSibling;
expenseSearchButton.addEventListener("click", searchExpenses);
incomeSearchButton.addEventListener("click", searchIncome);


