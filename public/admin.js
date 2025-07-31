// admin.js

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#transactions-body');
  const loadingMessage = document.querySelector('#loading-message');
  const errorMessage = document.querySelector('#error-message');

  try {
    const res = await fetch('/admin/transactions');
    const data = await res.json();

    if (!Array.isArray(data.transactions)) {
      throw new Error('Unexpected data format');
    }

    const now = Date.now();

    data.transactions.forEach((tx) => {
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
  } catch (err) {
    console.error('Failed to load transactions:', err);
    errorMessage.textContent = 'Failed to load transactions.';
  } finally {
    loadingMessage.remove();
  }
});