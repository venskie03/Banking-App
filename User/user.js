window.onload = function () {
  const loggedUser = JSON.parse(localStorage.getItem('currentUser'));

  if (loggedUser) {
    const userInfoElement = document.getElementById('user-info');
    const banknumber = document.getElementById('banknumber');
    const useramountbalance = document.getElementById('ammountbalance');
    const totalDepositedSpan = document.getElementById('totaldeposited');
    const totalWithdrawnSpan = document.getElementById('totalwithdrawn');

    updateUserInfo(loggedUser, userInfoElement, banknumber, useramountbalance, totalDepositedSpan, totalWithdrawnSpan); 
    userInfoElement.classList.add('logged-in');
    banknumber.classList.add('logged-in');

    loadTransactionHistory(loggedUser);

    if (loggedUser.totalDeposited === undefined) {
      loggedUser.totalDeposited = 0;
    }
    if (loggedUser.totalWithdrawn === undefined) {
      loggedUser.totalWithdrawn = 0;
    }

    const savedTotalDeposited = localStorage.getItem('totalDeposited');
    if (savedTotalDeposited !== null) {
      loggedUser.totalDeposited = parseFloat(savedTotalDeposited);
    }

    const savedTotalWithdrawn = localStorage.getItem('totalwithdrawn');
    if (savedTotalWithdrawn !== null) {
      loggedUser.totalWithdrawn = parseFloat(savedTotalWithdrawn);
    }
   
    totalDepositedSpan.innerText = localStorage.getItem(`totalDeposited_${loggedUser.username}`) || 0;
    totalWithdrawnSpan.innerText = localStorage.getItem(`totalWithdrawn_${loggedUser.username}`) || 0;
  }
};

const select = document.getElementById('selectpaymemt');
const paymentMethodLabel = document.getElementById('paymentlabel');
const paymentMethodInput = document.getElementById('paymentmethod');

select.addEventListener('change', function() {
  if (select.value === 'Gcash') {
    paymentMethodLabel.textContent = 'Gcash Number';
    paymentMethodInput.type = 'number';

  } else if (select.value === 'Paypal') {
    paymentMethodLabel.textContent = 'Paypal Account';
    paymentMethodInput.type = 'text';

  }
});
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


function transferMoney() {
  console.log("Transfer money function is called"); 

  const loggedUser = JSON.parse(localStorage.getItem('currentUser'));

  let sender = loggedUser.username;
  let receiver = document.getElementById('receiver').value;
  let amount = Number(document.getElementById('amount').value);

  let users = JSON.parse(localStorage.getItem('users'));
  let senderUser = users.find(function (user) {
    return user.username === sender;
  });

  let receiverUser = users.find(function (user) {
    return user.username === receiver;
  });

  console.log("Sender User:", senderUser);
  console.log("Receiver User:", receiverUser);

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
    localStorage.setItem('currentUser', JSON.stringify(senderUser));

    const useramountbalance = document.getElementById('ammountbalance');
    useramountbalance.innerText = senderUser.balance;

    alert('Transaction successful!');
    saveTransactionHistory(senderUser.username, `Sent $${amount} to ${receiver}`, 'sent');
    console.log("Transaction history for sender saved");
  
    saveTransactionHistory(receiverUser.username, `Received $${amount} from ${sender}`, 'received');
    console.log("Transaction history for receiver saved"); 
    location.reload()

    document.getElementById('transfer-form').reset();
  }
}

function updateUserInfo(loggedUser, userInfoElement, banknumber, userammountbalance, totalDepositedSpan, totalWithdrawnSpan) {
  userInfoElement.innerHTML = loggedUser.name;
  banknumber.innerHTML = loggedUser.bankid;
  userammountbalance.innerHTML = loggedUser.balance;
  totalDepositedSpan.innerText = localStorage.getItem(`totalDeposited_${loggedUser.username}`) || 0;
  totalWithdrawnSpan.innerText = localStorage.getItem(`totalWithdrawn_${loggedUser.username}`) || 0;
}

function searchreceiver() {
  const userInput = event.target.value.toLowerCase();
  const users = JSON.parse(localStorage.getItem('users'));
  const matches = users.filter(user => user.username.toLowerCase().includes(userInput));
  
  const receiverName = document.getElementById('receivername');
  const receiverBankNumber = document.getElementById('receiverbanknumber');
  
  if (matches.length > 0) {
    receiverName.innerHTML = matches[0].username;
    receiverBankNumber.value = matches[0].bankid;
    receiverBankNumber.removeAttribute('disabled');
  } else {
    receiverName.innerHTML = '';
    receiverBankNumber.value = '';
    receiverBankNumber.setAttribute('disabled', 'disabled');
  }
  
  receiverBankNumber.name = 'banknum';
}

function withdrawMoney() {
  const loggedUser = JSON.parse(localStorage.getItem('currentUser'));
  const withdrawAmount = Number(document.getElementById('withdrawammount').value);

  if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
    if (loggedUser) {
      if (loggedUser.balance < withdrawAmount) {
        alert('Not enough money in the account!');
      } else {
        loggedUser.balance -= withdrawAmount;
        const totalWithdrawn = parseFloat(localStorage.getItem(`totalWithdrawn_${loggedUser.username}`)) || 0;
        localStorage.setItem(`totalWithdrawn_${loggedUser.username}`, totalWithdrawn + withdrawAmount);
        const users = JSON.parse(localStorage.getItem('users'));
        const userToUpdate = users.find(user => user.username === loggedUser.username);
        userToUpdate.balance = loggedUser.balance;
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('currentUser', JSON.stringify(loggedUser));

        document.getElementById('ammountbalance').innerText = loggedUser.balance;
        document.getElementById('totalwithdrawn').innerText = totalWithdrawn + withdrawAmount;
        alert('Withdrawal successful!');
        location.reload()
        saveTransactionHistory(loggedUser.username, `Withdraw $${withdrawAmount}`, 'withdraw');
      }
    }
  } else {
    alert('Please enter a valid withdrawal amount.');
  }
}

function depositMoney() {
  const depositAmount = Number(document.getElementById('deposit').value);

  if (!isNaN(depositAmount) && depositAmount > 0) {
    const loggedUser = JSON.parse(localStorage.getItem('currentUser'));

    if (loggedUser) {
      loggedUser.balance += depositAmount;

      const totalDeposited = parseFloat(localStorage.getItem(`totalDeposited_${loggedUser.username}`)) || 0;
      localStorage.setItem(`totalDeposited_${loggedUser.username}`, totalDeposited + depositAmount);

      localStorage.setItem('currentUser', JSON.stringify(loggedUser));

      const totalDepositedSpan = document.getElementById('totaldeposited');
      totalDepositedSpan.innerText = totalDeposited; 

      const userAmountBalance = document.getElementById('ammountbalance');
      userAmountBalance.innerText = loggedUser.balance;

      const users = JSON.parse(localStorage.getItem('users'));
      const userToUpdate = users.find(user => user.username === loggedUser.username);
      userToUpdate.balance = loggedUser.balance;
      localStorage.setItem('users', JSON.stringify(users));

      alert("Successfully Deposited Money");
      location.reload()

      saveTransactionHistory(loggedUser.username, `Deposited $${depositAmount}`, 'deposit');

      document.getElementById('deposit').value = '';
    }
  } else {
    alert('Please enter a valid deposit amount.');
  }
}

function saveTransactionHistory(username, description, type) {
  let transactions = JSON.parse(localStorage.getItem(`${username}_transactions`)) || [];

  let textColorClass = type === 'send' || type === 'withdraw' || type === 'expense' ? 'text-red-500' : 'text-green-500';

  transactions.push({
    description,
    textColorClass, 
    type, 
  });

  localStorage.setItem(`${username}_transactions`, JSON.stringify(transactions));
}

function loadTransactionHistory(loggedUser) {
  const transactions = JSON.parse(localStorage.getItem(`${loggedUser.username}_transactions`)) || [];
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  transactions.forEach(transaction => {
    const historyItem = document.createElement('li');
    historyItem.textContent = transaction.description;
    if (transaction.type === 'sent') {
      historyItem.classList.add('text-red-500');  
    } else if (transaction.type === 'withdraw') {
      historyItem.classList.add('text-red-500'); 
    } else {
      historyItem.classList.add('text-green-500'); 
    }

    historyList.appendChild(historyItem);
  });
}

const clearHistoryButton = document.getElementById('clear-history');
  
clearHistoryButton.addEventListener('click', function() {
  const loggedUser = JSON.parse(localStorage.getItem('currentUser'));

  localStorage.removeItem(`${loggedUser.username}_transactions`);

  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
});