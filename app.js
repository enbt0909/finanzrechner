document.addEventListener('DOMContentLoaded', () => {
    const financeForm = document.getElementById('financeForm');
    const financeTableBody = document.getElementById('financeTableBody');
    const totalSumElement = document.getElementById('totalSum');

    financeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const businessName = document.getElementById('businessName').value;
        const paymentType = document.getElementById('paymentType').value;
        const amount = parseFloat(document.getElementById('amount').value);

        addToAccountStatement(businessName, paymentType, amount);

        let exists = false;
        financeTableBody.querySelectorAll('tr').forEach(row => {
            if (row.cells[0].textContent === businessName) {
                exists = true;
                let currentAmount = parseFloat(row.cells[2].textContent);
                currentAmount += amount;
                row.cells[2].textContent = currentAmount.toFixed(2);
                row.cells[3].textContent = currentAmount.toFixed(2);
            }
        });

        if (!exists) {
            const newRow = financeTableBody.insertRow();
            newRow.innerHTML = `
                <td>${businessName}</td>
                <td>${paymentType}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${amount.toFixed(2)}</td>
            `;
        }

        financeForm.reset();
        updateTotalSum();
    });

    document.addEventListener('DOMContentLoaded', () => {

        loadStoredTransactions();
    });
    
    function loadStoredTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(transaction => {
            addToAccountStatement(transaction.businessName, transaction.paymentType, transaction.amount);
        });
    }

    function addToAccountStatement(businessName, paymentType, amount) {
        const accountStatementBody = document.getElementById('accountStatementBody');
        const newRow = accountStatementBody.insertRow();
        const currentDate = new Date().toLocaleDateString('de-DE');

        newRow.innerHTML = `
            <td>${businessName}</td>
            <td>${paymentType}</td>
            <td>${amount.toFixed(2)}</td>
            <td>${currentDate}</td>
        `;

        const transaction = { businessName, paymentType, amount, date: currentDate };
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function updateTotalSum() {
        let totalSum = 0;
        financeTableBody.querySelectorAll('tr').forEach(row => {
            const amount = parseFloat(row.cells[2].textContent);
            totalSum += amount;
        });
        totalSumElement.textContent = totalSum.toFixed(2);
    }
});