export function renderTransactionTable(transactions, tableBody) {
  const now = Date.now();

  transactions.forEach((tx) => {
    const isActive = new Date(tx.expireTime).getTime() > now;

    const row = document.createElement('tr');
    if (isActive) row.classList.add('active');

    row.innerHTML = `
      <td>${tx.id}</td>
      <td>${tx.licensePlate}</td>
      <td>${tx.hours}</td>
      <td>${new Date(tx.startTime).toLocaleString()}</td>
      <td>${new Date(tx.expireTime).toLocaleString()}</td>
      <td>${new Date(tx.paidAt).toLocaleString()}</td>
      <td><code>${tx.stripeSessionId}</code></td>
    `;

    tableBody.appendChild(row);
  });
}