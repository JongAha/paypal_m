
// Format balance with proper currency formatting
function formatBalance(value) {
    // Remove all non-numeric characters except decimal point
    let numericValue = value.replace(/[^0-9.-]/g, '');

    // Parse as float and format
    let number = parseFloat(numericValue);
    if (isNaN(number)) {
        number = 8888888.88; // Default value
    }

    return `€${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Initialize balance from localStorage or default
function initializeBalance() {
    const savedBalance = localStorage.getItem('paypalBalance');
    const balanceInput = document.getElementById('balanceAmount');
    if (savedBalance) {
        balanceInput.value = savedBalance;
    } else {
        const defaultBalance = formatBalance('8888888.88');
        balanceInput.value = defaultBalance;
        localStorage.setItem('paypalBalance', defaultBalance);
    }
}

// Enable editing when clicked
function enableEdit() {
    const balanceInput = document.getElementById('balanceAmount');
    balanceInput.focus();
    balanceInput.select();
}

// Save and format balance when focus is lost
function saveBalance() {
    const balanceInput = document.getElementById('balanceAmount');
    const formattedBalance = formatBalance(balanceInput.value);
    balanceInput.value = formattedBalance;
    localStorage.setItem('paypalBalance', formattedBalance);
}

// Handle enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.target.blur();
    }
}

// Load transactions from localStorage
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transactionsList = document.getElementById('transactionsList');

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<div class="no-transactions">No recent transactions</div>';
        return;
    }

    transactionsList.innerHTML = transactions.map(transaction => `
    <div class="transaction card" style="margin-left: 0;margin-right: 0;box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);border: 1px solid #e0e0e0;">
        <div class="transaction-icon">
            <i class="fas fa-store"></i>
        </div>
        <div class="transaction-details">
            <div class="transaction-user">${transaction.recipient}</div>
            <div class="transaction-date">${transaction.date}</div>
        </div>
        <div class="transaction-amount">€${transaction.amount}</div>
    </div>
    `).join('');
}

// Clear all transactions
function clearAllTransactions() {
    localStorage.removeItem('transactions');
    loadTransactions();
}

// Navigate to send money page
function goToSendMoney() {
    window.location.href = 'send.html';
}

// Show success toast
function showSuccessToast() {
    const lastTransaction = JSON.parse(localStorage.getItem('lastTransaction') || 'null');
    if (lastTransaction) {
        const toast = document.getElementById('successToast');
        const subtitle = document.getElementById('toastSubtitle');
        subtitle.textContent = `€${lastTransaction.amount} sent to ${lastTransaction.recipient}`;

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            localStorage.removeItem('lastTransaction');
        }, 3000);
    }
}

// Initialize page
window.onload = function () {
    initializeBalance();
    loadTransactions();

    // Check if we just completed a transaction
    if (localStorage.getItem('showSuccessToast') === 'true') {
        localStorage.removeItem('showSuccessToast');
        setTimeout(showSuccessToast, 500);
    }
}
