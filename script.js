// Initialize transactions array from local storage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM elements
const balanceEl = document.getElementById('balance');
const transactionListEl = document.getElementById('transactionList');
const transactionForm = document.getElementById('transactionForm');
const transactionNameEl = document.getElementById('transactionName');
const transactionAmountEl = document.getElementById('transactionAmount');
const transactionTypeEl = document.getElementById('transactionType');

// Initialize the app on page load
function init() {
    updateTransactionList();
    updateBalance();
}

// Add a new transaction
function addTransaction(e) {
    e.preventDefault();

    const name = transactionNameEl.value.trim();
    let amount = parseFloat(transactionAmountEl.value);
    const type = transactionTypeEl.value;

    // Validation
    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid transaction name and amount (greater than 0).');
        return;
    }

    // Convert amount to negative for expenses
    if (type === 'expense') {
        amount = -Math.abs(amount);
    }

    // Create transaction object
    const transaction = {
        id: generateId(),
        name,
        amount,
        type,
        date: new Date().toISOString(),
    };

    // Add to transactions array and save to local storage
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update UI
    updateTransactionList();
    updateBalance();
    transactionForm.reset();
}

// Generate unique ID for transactions
function generateId() {
    return Math.floor(Math.random() * 1000000);
}

// Update transaction list in the UI
function updateTransactionList() {
    transactionListEl.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction-item', transaction.type);
        li.innerHTML = `
            ${transaction.name}: $${Math.abs(transaction.amount).toFixed(2)}
            <span>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
        `;
        transactionListEl.appendChild(li);
    });
}

// Update balance display
function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceEl.textContent = balance.toFixed(2);
    balanceEl.parentElement.style.color = balance >= 0 ? '#4caf50' : '#f44336';
}

// Delete a transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateBalance();
}

// Event listener for form submission
transactionForm.addEventListener('submit', addTransaction);

// Initialize app on page load
init();

// Optional Feature: Add Category Selection
// Modify HTML form to include category dropdown
// Add this to the form in index.html:
/*
<select id="transactionCategory">
    <option value="groceries">Groceries</option>
    <option value="entertainment">Entertainment</option>
    <option value="salary">Salary</option>
    <option value="other">Other</option>
</select>
*/

// Update JavaScript to handle categories
const transactionCategoryEl = document.createElement('select');
transactionCategoryEl.id = 'transactionCategory';
transactionCategoryEl.innerHTML = `
    <option value="groceries">Groceries</option>
    <option value="entertainment">Entertainment</option>
    <option value="salary">Salary</option>
    <option value="other">Other</option>
`;
transactionForm.insertBefore(transactionCategoryEl, transactionTypeEl);

// Update addTransaction to include category
function addTransactionWithCategory(e) {
    e.preventDefault();

    const name = transactionNameEl.value.trim();
    let amount = parseFloat(transactionAmountEl.value);
    const type = transactionTypeEl.value;
    const category = transactionCategoryEl.value;

    // Validation
    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid transaction name and amount (greater than 0).');
        return;
    }

    if (type === 'expense') {
        amount = -Math.abs(amount);
    }

    const transaction = {
        id: generateId(),
        name,
        amount,
        type,
        category,
        date: new Date().toISOString(),
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionListWithCategory();
    updateBalance();
    transactionForm.reset();
}

// Update transaction list to show category
function updateTransactionListWithCategory() {
    transactionListEl.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction-item', transaction.type);
        li.innerHTML = `
            ${transaction.name} (${transaction.category}): $${Math.abs(transaction.amount).toFixed(2)}
            <span>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
        `;
        transactionListEl.appendChild(li);
    });
}

// Replace original event listener with category version
transactionForm.removeEventListener('submit', addTransaction);
transactionForm.addEventListener('submit', addTransactionWithCategory);