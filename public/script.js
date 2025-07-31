const form = document.getElementById('payment-form');
const messageDiv = document.getElementById('message');
const submitButton = form.querySelector('button');
const hoursInput = form.hours;

// ---- Dynamic Parking Hours Info Setup ----
// Create a fixed-height wrapper for dynamic parking hour messages
let infoContainer = document.getElementById('hours-info-container');
if (!infoContainer) {
  infoContainer = document.createElement('div');
  infoContainer.id = 'hours-info-container';

  const placeholder = document.createElement('p');
  placeholder.id = 'hours-info';
  placeholder.setAttribute('aria-live', 'polite');
  placeholder.setAttribute('role', 'status');
  infoContainer.appendChild(placeholder);
  messageDiv.before(infoContainer);
}

const infoPlaceholder = document.getElementById('hours-info');

function showLoadingMessage() {
  hoursInput.disabled = true;

  infoPlaceholder.innerHTML = `
    <span class="spinner" aria-hidden="true"></span>
    Calculating available parking hours...`;
}

async function updateMaxHoursAllowed() {
  showLoadingMessage();

  try {
    await new Promise((res) => setTimeout(res, 1500)); // fake 1.5s delay
    const res = await fetch('/remaining-hours');
    const data = await res.json();

    if (typeof data.remainingHours === 'number') {
      const max = Math.max(1, data.remainingHours);
      hoursInput.max = max;
      hoursInput.value = Math.min(hoursInput.value, max);
      hoursInput.disabled = false;

      infoPlaceholder.textContent =
        max === 1
          ? 'You may purchase 1 hour right now — that’s the current maximum allowed.'
          : `You may purchase up to ${max} hours right now.`;
    } else {
      infoPlaceholder.textContent = 'Unable to determine parking hours.';
    }
  } catch (err) {
    console.error('Failed to fetch remaining hours:', err);
    infoPlaceholder.textContent = 'Error calculating available parking hours.';
  }
}

// Run on page load and every minute
updateMaxHoursAllowed();
setInterval(updateMaxHoursAllowed, 60 * 1000);

// ---- Form Handling Logic ----
form.noValidate = true;

hoursInput.addEventListener('keydown', (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
});

hoursInput.addEventListener('paste', (e) => {
  const pasted = (e.clipboardData || window.clipboardData).getData('text');
  if (!/^\d+$/.test(pasted)) e.preventDefault();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  messageDiv.textContent = '';
  messageDiv.style.color = '';
  messageDiv.removeAttribute('role');

  const licensePlate = form.licensePlate.value.trim().toUpperCase();
  const hours = parseInt(hoursInput.value);

  if (!licensePlate || hours < 1) {
    messageDiv.textContent = 'Please enter a valid license plate and at least 1 hour.';
    messageDiv.style.color = 'red';
    messageDiv.setAttribute('role', 'alert');
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  submitButton.disabled = true;
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Processing...';

  try {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licensePlate, hours }),
    });

    const data = await response.json();

    if (data.error) {
      messageDiv.textContent = data.error;
      messageDiv.style.color = 'red';
      messageDiv.setAttribute('role', 'alert');
      messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.location.href = data.url;
      return;
    }
  } catch (err) {
    messageDiv.textContent = 'An error occurred. Please try again.';
    messageDiv.style.color = 'red';
    messageDiv.setAttribute('role', 'alert');
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  submitButton.disabled = false;
  submitButton.textContent = originalButtonText;
});