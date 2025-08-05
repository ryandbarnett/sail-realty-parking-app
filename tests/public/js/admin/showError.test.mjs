/**
 * @jest-environment jsdom
 */

import { showError } from '../../../../public/js/admin/showError.mjs';

describe('showError', () => {
  test('sets the textContent of the element to the provided message', () => {
    const el = document.createElement('div');

    showError(el, 'Server exploded');

    expect(el.textContent).toBe('Server exploded');
  });

  test('handles empty message safely', () => {
    const el = document.createElement('div');
    el.textContent = 'Previous error';

    showError(el, '');

    expect(el.textContent).toBe('');
  });

  test('does not interpret HTML in the message', () => {
    const el = document.createElement('div');
    const malicious = '<script>stealCookies()</script>';

    showError(el, malicious);

    expect(el.textContent).toBe(malicious);
    expect(el.innerHTML).toBe('&lt;script&gt;stealCookies()&lt;/script&gt;'); // ✅ what browsers do
  });
});