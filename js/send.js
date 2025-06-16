
let dropdownTimeout;
let allRecentRecipients = [];

// Generate avatar text from name
function generateAvatarText(name) {
    if (!name) return '';

    // Check if contains Chinese characters
    const chineseRegex = /[\u4e00-\u9fff]/;
    if (chineseRegex.test(name)) {
        return name.charAt(0);
    } else {
        // For English names, take first 2 letters
        return name.substring(0, 2).toUpperCase();
    }
}

// Get recent recipients from localStorage (up to 5)
function getRecentRecipients() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const recipients = [];
    const seen = new Set();

    // Get unique recipients from recent transactions (up to 5)
    for (const transaction of transactions) {
        if (!seen.has(transaction.recipient) && recipients.length < 5) {
            recipients.push(transaction.recipient);
            seen.add(transaction.recipient);
        }
    }

    return recipients;
}

// Filter recipients based on input
function filterRecipients(input) {
    if (!input.trim()) {
        return allRecentRecipients;
    }

    const searchTerm = input.toLowerCase();
    return allRecentRecipients.filter(recipient =>
        recipient.toLowerCase().includes(searchTerm)
    );
}

// Show dropdown with filtered recipients
function showDropdown(filteredRecipients) {
    const dropdown = document.getElementById('dropdown');

    if (filteredRecipients.length === 0) {
        dropdown.classList.remove('show');
        return;
    }

    dropdown.innerHTML = filteredRecipients.map(recipient => `
    <div class="dropdown-item" onmousedown="selectRecipient('${recipient}')">
        <div class="dropdown-avatar">${generateAvatarText(recipient)}</div>
        <div class="dropdown-name">${recipient}</div>
    </div>
    `).join('');

    dropdown.classList.add('show');
}

// Hide dropdown with delay to allow for clicks
function hideDropdown() {
    dropdownTimeout = setTimeout(() => {
        document.getElementById('dropdown').classList.remove('show');
    }, 200);
}

// Handle input changes (real-time matching)
function handleInput() {
    const input = document.getElementById('searchInput');
    const inputValue = input.value;

    // Check if next button should be enabled
    checkInput();

    // Filter and show matching recipients
    const filteredRecipients = filterRecipients(inputValue);
    showDropdown(filteredRecipients);
}

// Handle focus event
function handleFocus() {
    const input = document.getElementById('searchInput');
    const inputValue = input.value;

    // Show all recipients if input is empty, or filtered ones if there's input
    const filteredRecipients = filterRecipients(inputValue);
    showDropdown(filteredRecipients);
}

// Select recipient from dropdown
function selectRecipient(recipient) {
    clearTimeout(dropdownTimeout);
    const input = document.getElementById('searchInput');
    input.value = recipient;
    checkInput();
    document.getElementById('dropdown').classList.remove('show');
}

// Check input and enable/disable next button
function checkInput() {
    const input = document.getElementById('searchInput');
    const nextBtn = document.getElementById('nextBtn');

    if (input.value.trim() !== '') {
        nextBtn.classList.add('enabled');
    } else {
        nextBtn.classList.remove('enabled');
    }
}

// Navigate to confirmation page
function goToConfirmation() {
    const input = document.getElementById('searchInput');
    const recipientName = input.value.trim();

    if (recipientName !== '') {
        // Store recipient name for confirmation page
        localStorage.setItem('currentRecipient', recipientName);
        window.location.href = 'confirm.html';
    }
}

// Initialize page
window.onload = function () {
    // Load all recent recipients on page load
    allRecentRecipients = getRecentRecipients();
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer.contains(event.target)) {
        document.getElementById('dropdown').classList.remove('show');
    }
});