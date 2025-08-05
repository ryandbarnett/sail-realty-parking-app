/**
 * @jest-environment jsdom
 */

import { renderTransactionTable } from '../../../../public/js/admin/renderTransactionTable.mjs';

describe('renderTransactionTable', () => {
  let tableBody;

  beforeEach(() => {
    tableBody = document.createElement('tbody');
  });

  test('renders rows for each transaction', () => {
    const transactions = [
      {
        id: 1,
        licensePlate: 'ABC123',
        hours: 2,
        startTime: new Date().toISOString(),
        expireTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour in future
        paidAt: new Date().toISOString(),
        stripeSessionId: 'sess_123',
      },
      {
        id: 2,
        licensePlate: 'XYZ789',
        hours: 1,
        startTime: new Date().toISOString(),
        expireTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        paidAt: new Date().toISOString(),
        stripeSessionId: 'sess_456',
      },
    ];

    renderTransactionTable(transactions, tableBody);

    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(2);

    const activeRow = rows[0];
    const inactiveRow = rows[1];

    expect(activeRow.classList.contains('active')).toBe(true);
    expect(inactiveRow.classList.contains('active')).toBe(false);

    expect(activeRow.innerHTML).toMatch(/ABC123/);
    expect(inactiveRow.innerHTML).toMatch(/XYZ789/);
  });

  test('formats timestamp fields into readable strings', () => {
    const fixedDate = new Date('2025-08-01T12:00:00Z');
    const iso = fixedDate.toISOString();

    const tx = {
      id: 1,
      licensePlate: 'FOO123',
      hours: 3,
      startTime: iso,
      expireTime: iso,
      paidAt: iso,
      stripeSessionId: 'sess_abc',
    };

    renderTransactionTable([tx], tableBody);
    const html = tableBody.innerHTML;

    // Spot check that a human-readable date exists
    expect(html).toMatch(/2025/i);
    expect(html).toMatch(/FOO123/);
    expect(html).toMatch(/sess_abc/);
  });
});