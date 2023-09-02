const userListElement = document.getElementById('user-list');
const createUserFormElement = document.querySelector('#create-user form');
const senderInputElement = document.getElementById('sender');
const receiverInputElement = document.getElementById('receiver');
const amountInputElement = document.getElementById('amount');
const accountInputElement = document.getElementById('account');
const depositInputElement = document.getElementById('deposit');
const withdrawInputElement = document.getElementById('withdraw');
const transferFormElement = document.querySelector('#transaction form:first-of-type');
const depositFormElement = document.querySelector('#transaction form:nth-of-type(2)');
const withdrawFormElement = document.querySelector('#transaction form:nth-of-type(3)');

let users = [];
window.onload = function() {
    let usersString = localStorage.getItem('users');
    if (usersString) {
        users = JSON.parse(usersString);
        renderUserList();
    }
}
updateDateTime();
setInterval(updateDateTime, 1000);

function updateDateTime() {
  const now = new Date();
  
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let ampm = '';
  
  if (hours < 12) {
    ampm = 'AM';
  } else {
    ampm = 'PM';
  }
  
  const hour12 = hours % 12 || 12;
  
  const time = hour12.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') + ' ' + ampm;
  
  const day = now.getDate();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  
  const dayOfWeek = now.toLocaleString('default', { weekday: 'long' });
  
  const date = month + ' ' + day + ', ' + year;
  
  document.getElementById('time').textContent = time;
  document.getElementById('date').textContent = date;
  document.getElementById('day').textContent = dayOfWeek;
}
function renderUserList() {
    let html = '';
    users.forEach(function(user, index) {
        html += `<tr class="h-10 grid-col-6">
                    <td class="pl-14">${user.name}</td>
                    <td class="pl-14">${user.balance}</td>
                    <td class="pl-14">${user.username}</td>
                    <td class="pl-14">${user.password}</td>
                    <td class="pl-14">${user.bankid}</td>
                    <td class="pl-20"><ion-icon name="trash-outline" onclick="deleteUser(${index})" id="deletebtn" class="text-red-500 cursor-pointer"></ion-icon></td>
                </tr>`;
    });
    userListElement.innerHTML = html;
}
function deleteUser(index) {
    if (confirm("Are you sure you want to delete this user?")) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        renderUserList();
        alert('User deleted successfully!');
    }
}

createUserFormElement.addEventListener('submit', function(event) {
event.preventDefault();
let name = event.target.elements.name.value;    
let bankid = event.target.elements.bankid.value;
let username = event.target.elements.username.value;
let password = event.target.elements.password.value;
let balance = Number(event.target.elements.balance.value);
let userExists = users.some(function(user) {
return user.username === username;
});
if (userExists) {
alert('Username already exists!');
} else {
let user = {name: name, bankid: bankid, username: username, password: password, balance: balance};
users.push(user);
localStorage.setItem('users', JSON.stringify(users));
renderUserList();
alert('User created successfully!');
event.target.reset();
location.reload();
}
});

transferFormElement.addEventListener('submit', function(event) {
    event.preventDefault();
    let sender = event.target.elements.sender.value;
    let receiver = event.target.elements.receiver.value;
    let amount = Number(event.target.elements.amount.value);
    let senderUser = users.find(function(user) {
        return user.username === sender;
    });
    let receiverUser = users.find(function(user) {
        return user.username === receiver;
    });
    if (!senderUser) {
        alert('Sender does not exist!');
    } else if (!receiverUser) {
        alert('Receiver does not exist!');
    } else if (senderUser.balance < amount) {
        alert('Not enough money in the sender account!');
    } else {
        senderUser.balance -= amount;
        receiverUser.balance += amount;
        localStorage.setItem('users', JSON.stringify(users));
        renderUserList();
        alert('Transaction successful!');
        event.target.reset();
    }
});

depositFormElement.addEventListener('submit', function(event) {
    event.preventDefault();
    let account = event.target.elements.account.value;
    let deposit = Number(event.target.elements.deposit.value);
    let user = users.find(function(user) {
        return user.username === account;
    });
    if (!user) {
        alert('Account does not exist!');
    } else {
        user.balance += deposit;
        localStorage.setItem('users', JSON.stringify(users));
        renderUserList();
        alert('Deposit successful!');
        event.target.reset();
    }
});

withdrawFormElement.addEventListener('submit', function(event) {
    event.preventDefault();
    let account = event.target.elements.account.value;
    let withdraw = Number(event.target.elements.withdraw.value);
    let user = users.find(function(user) {
        return user.username === account;
    });
    if (!user) {
        alert('Account does not exist!');
    } else if (user.balance < withdraw) {
        alert('Not enough money in the account!');
    } else {
        user.balance -= withdraw;
        localStorage.setItem('users', JSON.stringify(users));
        renderUserList();
        alert('Withdraw successful!');
        event.target.reset();
    }
});
const banknumber = document.getElementById('bankid');
function generateRandomNumber() {
    let randomNumber = "";
    for (let i = 0; i < 16; i++) {
      if (i === 4 || i === 8 || i === 12) {
        randomNumber += "-";
      }
      randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
  }
banknumber.value = generateRandomNumber();
  
  