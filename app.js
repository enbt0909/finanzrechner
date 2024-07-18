document.addEventListener('DOMContentLoaded', () => {
    const financeForm = document.getElementById('financeForm');
    const financeTableBody = document.getElementById('financeTableBody');
    const accountStatementBody = document.getElementById('accountStatementBody');
    const totalSumElement = document.getElementById('totalSum');

    financeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const businessName = document.getElementById('businessName').value;
        const paymentType = document.getElementById('paymentType').value;
        const amount = parseFloat(document.getElementById('amount').value);

        console.log(`Submit: ${businessName}, ${paymentType}, ${amount}`);

        addToAccountStatement(businessName, paymentType, amount, true);
        addOrUpdateTableRow(businessName, paymentType, amount);

        financeForm.reset();
        updateTotalSum();
    });

    loadStoredTransactions();

    function loadStoredTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        console.log('Loaded transactions:', transactions);
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
            console.log('Saved transaction:', transaction);
        }

        const newRow = accountStatementBody.insertRow();
        newRow.innerHTML = `
            <td>${businessName}</td>
            <td>${paymentType}</td>
            <td class="${amount < 0 ? 'negative' : ''}">${amount.toFixed(2)}</td>
            <td>${currentDate}</td>
        `;
    }

    function addOrUpdateTableRow(businessName, paymentType, amount, isNewTransaction = true) {
        let exists = false;
        financeTableBody.querySelectorAll('tr').forEach(row => {
            if (row.cells[0].textContent === businessName) {
                exists = true;
                if (isNewTransaction) {
                    let currentAmount = parseFloat(row.cells[2].textContent);
                    currentAmount += amount;
                    row.cells[2].textContent = currentAmount.toFixed(2);
                    row.cells[2].className = currentAmount < 0 ? 'negative' : '';
                }
            }
        });

        if (!exists) {
            const newRow = financeTableBody.insertRow();
            newRow.innerHTML = `
                <td>${businessName}</td>
                <td>${paymentType}</td>
                <td class="${amount < 0 ? 'negative' : ''}">${amount.toFixed(2)}</td>
            `;
        }
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
