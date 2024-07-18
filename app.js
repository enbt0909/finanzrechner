document.addEventListener('DOMContentLoaded', () => {
    const financeForm = document.getElementById('financeForm');
    const financeTableBody = document.getElementById('financeTableBody');
    const totalSumElement = document.getElementById('totalSum');

    financeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const businessName = document.getElementById('businessName').value;
        const paymentType = document.getElementById('paymentType').value;
        const amount = parseFloat(document.getElementById('amount').value);

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

    function updateTotalSum() {
        let totalSum = 0;
        financeTableBody.querySelectorAll('tr').forEach(row => {
            const amount = parseFloat(row.cells[2].textContent);
            totalSum += amount;
        });
        totalSumElement.textContent = totalSum.toFixed(2);
    }
});