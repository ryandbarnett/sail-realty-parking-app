// public/js/admin.mjs

const TZ = 'America/Los_Angeles';
const dtFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
});

function fmt(isoString) {
  try {
    return dtFmt.format(new Date(isoString));
  } catch {
    return isoString ?? '';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#transactions-body');
  const loadingMessage = document.querySelector('#loading-message');
  const errorMessage = document.querySelector('#error-message');

  try {
    const transactions = await fetchTransactions();
    renderTransactionTable(transactions, tableBody);
  } catch (err) {
    console.error('Failed to load transactions:', err);
    showError(errorMessage, 'Failed to load transactions.');
  } finally {
    if (loadingMessage) loadingMessage.remove();
  }
});

async function fetchTransactions() {
  const res = await fetch('/admin/transactions', { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  if (!Array.isArray(data.transactions)) {
    throw new Error('Unexpected data format');
  }

  return data.transactions;
}

function renderTransactionTable(transactions, tableBody) {
  tableBody.innerHTML = '';

  const now = Date.now();
  for (const tx of transactions) {
    // Prefer server-provided isActive, fall back to client calc
    const active = typeof tx.isActive === 'boolean'
      ? tx.isActive
      : new Date(tx.expireTime).getTime() > now;

    const tr = document.createElement('tr');
    if (active) tr.classList.add('active');

    tr.innerHTML = `
      <td>${tx.licensePlate ?? ''}</td>
      <td>${tx.hours ?? ''}</td>
      <td>${fmt(tx.startTime)}</td>
      <td>${fmt(tx.expireTime)}</td>
    `;

    tableBody.appendChild(tr);
  }
}

function showError(element, message) {
  if (element) element.textContent = message;
}
