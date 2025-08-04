import { fetchTransactions } from './admin/fetchTransactions.js';
import { renderTransactionTable } from './admin/renderTransactionTable.js';
import { showError } from './admin/showError.js';

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