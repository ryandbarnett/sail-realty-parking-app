/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

// Patch scrollIntoView which jsdom does not implement
window.HTMLElement.prototype.scrollIntoView = () => {};

// Load module *after* jsdom is set up
const { setupFormHandlers } = await import(
  new URL('../../../public/js/formHandler.mjs', import.meta.url)
);

describe('formHandler', () => {
  let form, messageDiv, submitButton, hoursInput, licensePlateInput, mockNavigate;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="payment-form">
        <input type="text" name="licensePlate" value="" />
        <input type="number" name="hours" value="1" />
        <button type="submit">Submit</button>
      </form>
      <div id="message"></div>
    `;

    form = document.getElementById('payment-form');
    messageDiv = document.getElementById('message');
    submitButton = form.querySelector('button');
    hoursInput = form.querySelector('[name="hours"]');
    licensePlateInput = form.querySelector('[name="licensePlate"]');

    mockNavigate = jest.fn();

    setupFormHandlers({
      form,
      messageDiv,
      submitButton,
      hoursInput,
      navigate: mockNavigate,
    });

    mockNavigate.mockClear();
  });

  test('blocks submission if license plate is empty', () => {
    const event = new Event('submit');
    form.dispatchEvent(event);

    expect(messageDiv.textContent).toMatch(/valid license plate/i);
    expect(submitButton.disabled).toBe(false);
  });

  test('blocks submission if hours < 1', () => {
    licensePlateInput.value = 'ABC123';
    hoursInput.value = '0';

    const event = new Event('submit');
    form.dispatchEvent(event);

    expect(messageDiv.textContent).toMatch(/at least 1 hour/i);
  });

  test('blocks submission if hoursInput is disabled (e.g. parking not allowed)', () => {
    licensePlateInput.value = 'XYZ789';
    hoursInput.value = '2';
    hoursInput.disabled = true;

    const event = new Event('submit');
    form.dispatchEvent(event);

    expect(messageDiv.textContent).toContain('Parking is not currently allowed.');
  });

  test('submits form if inputs are valid and enabled', async () => {
    licensePlateInput.value = 'TEST123';
    hoursInput.value = '2';
    hoursInput.disabled = false;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ url: 'https://mocked-checkout.com' }),
      })
    );

    const event = new Event('submit');
    await form.dispatchEvent(event);
    await Promise.resolve(); // wait for async

    expect(fetch).toHaveBeenCalledWith('/create-checkout-session', expect.any(Object));
    expect(mockNavigate).toHaveBeenCalledWith('https://mocked-checkout.com');
  });

  test('shows error if backend returns error', async () => {
    licensePlateInput.value = 'TEST123';
    hoursInput.value = '2';
    hoursInput.disabled = false;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: 'Invalid request' }),
      })
    );

    const event = new Event('submit');
    await form.dispatchEvent(event);
    await Promise.resolve();

    expect(messageDiv.textContent).toMatch(/invalid request/i);
  });
});