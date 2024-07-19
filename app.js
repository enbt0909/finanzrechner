document.addEventListener('DOMContentLoaded', () => {
    const financeForm = document.getElementById('financeForm');
    const financeTableBody = document.getElementById('financeTableBody');
    const accountStatementBody = document.getElementById('accountStatementBody');
    const totalSumElement = document.getElementById('totalSum');

    setTimeout(function() {
        var knockoutElement = document.querySelector('.header');
        if (knockoutElement) {
            knockoutElement.classList.add('hidden');
        }
    }, 5000);

    financeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const businessName = document.getElementById('businessName').value;
        const paymentType = document.getElementById('paymentType').value;
        const amount = parseFloat(document.getElementById('amount').value);

        addToAccountStatement(businessName, paymentType, amount);
        addOrUpdateTableRow(businessName, paymentType, amount);

        financeForm.reset();
        updateTotalSum();
    });

    loadStoredTransactions();

    function loadStoredTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(transaction => {
            addToAccountStatement(transaction.businessName, transaction.paymentType, parseFloat(transaction.amount), false, transaction.date);
            addOrUpdateTableRow(transaction.businessName, transaction.paymentType, parseFloat(transaction.amount), false);
        });
        updateTotalSum();
    }

    function addToAccountStatement(businessName, paymentType, amount, isNewTransaction = true, date = null) {
        const currentDate = date || new Date().toLocaleDateString('de-DE');
        if (isNewTransaction) {
            const transaction = { businessName, paymentType, amount, date: currentDate };
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        const newRow = accountStatementBody.insertRow();
        newRow.innerHTML = `
            <td>${businessName}</td>
            <td>${paymentType}</td>
            <td class="${amount < 0 ? 'negative' : ''}">${amount.toFixed(2)} €</td>
            <td>${currentDate} <span class="remove-btn" style="color: red; cursor: pointer;">&times;</span></td>
        `;

        newRow.querySelector('.remove-btn').addEventListener('click', function() {
            removeTransaction(newRow, businessName, currentDate);
        });
    }

    function removeTransaction(row, businessName, date) {
        row.remove();
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions = transactions.filter(transaction => !(transaction.businessName === businessName && transaction.date === date));
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateOverviewTable();
        updateTotalSum();
    }

    function addOrUpdateTableRow(businessName, paymentType, amount, isNewTransaction = true) {
        let exists = false;
        financeTableBody.querySelectorAll('tr').forEach(row => {
            if (row.cells[0].textContent === businessName) {
                exists = true;
                if (isNewTransaction) {
                    let currentAmount = parseFloat(row.cells[2].textContent);
                    currentAmount += amount;
                    row.cells[0].textContent = businessName;
                    row.cells[1].textContent = paymentType;
                    row.cells[2].textContent = currentAmount.toFixed(2) + ' €';
                }
            }
        });

        if (!exists) {
            const newRow = financeTableBody.insertRow();
            newRow.innerHTML = `
                <td>${businessName}</td>
                <td>${paymentType}</td>
                <td class="${amount < 0 ? 'negative' : ''}">${amount.toFixed(2)} €</td>
            `;
        }
        updateTotalSum();
    }

    function updateOverviewTable() {
        financeTableBody.innerHTML = '';

        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        transactions.forEach(transaction => {
            const row = financeTableBody.insertRow();
            row.innerHTML = `<td>${transaction.businessName}</td><td>${transaction.paymentType}</td><td>${transaction.amount.toFixed(2)} €</td><td>${transaction.date}</td>`;
        });
        updateTotalSum();
    }

    function updateTotalSum() {
        const euroSign = '€';
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let totalSum = transactions.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
        totalSumElement.textContent = totalSum.toFixed(2) + ' ' + euroSign;
    }
});