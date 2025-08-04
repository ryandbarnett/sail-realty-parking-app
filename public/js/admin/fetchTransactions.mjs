export async function fetchTransactions() {
  const res = await fetch('/admin/transactions');
  const data = await res.json();

  if (!Array.isArray(data.transactions)) {
    throw new Error('Unexpected data format');
  }

  return data.transactions;
}