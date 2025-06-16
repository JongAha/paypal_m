
let currentRecipient = '';

// Generate avatar text from name
function generateAvatarText(name) {
    if (!name) return '@';

    // Check if contains Chinese characters
    const chineseRegex = /[\u4e00-\u9fff]/;
    if (chineseRegex.test(name)) {
        return name.charAt(0);
    } else {
        // For English names, take first 2 letters
        return name.substring(0, 2).toUpperCase();
    }
}

// Format number input to only allow numbers and decimal point
function handleAmountInput() {
    const input = document.getElementById('amountInput');
    const sendBtn = document.getElementById('sendBtn');

    // Remove any non-numeric characters except decimal point
    let value = input.value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    input.value = value;

    // Update send button
    if (value && parseFloat(value) > 0) {
        sendBtn.classList.add('enabled');
        const formattedAmount = parseFloat(value).toFixed(2);
        sendBtn.textContent = `Send ${formattedAmount} EUR`;
    } else {
        sendBtn.classList.remove('enabled');
        sendBtn.textContent = 'Send';
    }
}

// Update balance in localStorage
function updateBalance(amount) {
    const currentBalance = localStorage.getItem('paypalBalance') || '€8,888,888.88';
    // Extract numeric value from balance string
    const numericBalance = parseFloat(currentBalance.replace(/[€,]/g, ''));
    const newBalance = numericBalance - amount;
    if (newBalance < 0) {
        alert('Insufficient balance');
        return 0;
    }
    const formattedBalance = `€${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    localStorage.setItem('paypalBalance', formattedBalance);
    return 1;
}

// Add transaction to localStorage
function addTransaction(recipient, amount) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');

    const newTransaction = {
        recipient: recipient,
        amount: amount.toFixed(2),
        date: formattedDate
    };

    transactions.unshift(newTransaction); // Add to beginning of array
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Store last transaction for toast
    localStorage.setItem('lastTransaction', JSON.stringify(newTransaction));
}

// Send money function
function sendMoney() {
    const input = document.getElementById('amountInput');
    const sendBtn = document.getElementById('sendBtn');
    const amount = parseFloat(input.value);

    if (amount && amount > 0) {
        // Update balance and add transaction
        if (updateBalance(amount) === 0) {
            return;
        }
        // Change button to sending state
        sendBtn.classList.remove('enabled');
        sendBtn.classList.add('sending');
        sendBtn.textContent = 'Sending...';
        sendBtn.disabled = true;
        addTransaction(currentRecipient, amount);

        // Set flag to show toast on index page
        localStorage.setItem('showSuccessToast', 'true');

        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
}

function goBack() {
    window.location.href = 'send.html';
}

// Initialize page
window.onload = function () {
    currentRecipient = localStorage.getItem('currentRecipient') || '@unknown';

    // Set recipient info
    document.getElementById('recipientUsername').textContent = currentRecipient;
    document.getElementById('recipientAvatar').textContent = generateAvatarText(currentRecipient);

    // Focus on amount input
    document.getElementById('amountInput').focus();
}