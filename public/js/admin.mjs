import { fetchTransactions } from './admin/fetchTransactions.mjs';
import { renderTransactionTable } from './admin/renderTransactionTable.mjs';
import { showError } from './admin/showError.mjs';

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
    loadingMessage.remove();
  }
});