export function setupParkingAvailabilityChecker({ hoursInput }) {
  const infoPlaceholder = setupInfoContainer();

  function showLoadingMessage() {
    hoursInput.disabled = true;
    hoursInput.setAttribute('aria-disabled', 'true');
    infoPlaceholder.innerHTML = `
      <span class="spinner" aria-hidden="true"></span>
      Calculating available parking hours...`;
  }

  async function updateMaxHoursAllowed() {
    showLoadingMessage();

    try {
      await new Promise((res) => setTimeout(res, 1500)); // Fake delay
      const res = await fetch('/remaining-hours');
      const data = await res.json();

      if (typeof data.remainingHours === 'number') {
        const max = data.remainingHours;

        if (max === 0) {
          disableInput('Parking is not allowed at this time. Please come back during valid hours.');
        } else {
          enableInput(max);
        }
      } else {
        disableInput('Unable to determine parking hours.');
      }
    } catch (err) {
      console.error('Failed to fetch remaining hours:', err);
      disableInput('Error calculating available parking hours.');
    }
  }

  function disableInput(message) {
    hoursInput.max = 0;
    hoursInput.value = 0;
    hoursInput.disabled = true;
    hoursInput.setAttribute('aria-disabled', 'true');
    infoPlaceholder.textContent = message;
  }

  function enableInput(max) {
    hoursInput.max = max;
    hoursInput.value = Math.min(hoursInput.value, max);
    hoursInput.disabled = false;
    hoursInput.removeAttribute('aria-disabled');

    infoPlaceholder.textContent =
      max === 1
        ? 'You may purchase 1 hour right now — that’s the current maximum allowed.'
        : `You may purchase up to ${max} hours right now.`;
  }

  function setupInfoContainer() {
    let container = document.getElementById('hours-info-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hours-info-container';

      const placeholder = document.createElement('p');
      placeholder.id = 'hours-info';
      placeholder.setAttribute('aria-live', 'polite');
      placeholder.setAttribute('role', 'status');
      container.appendChild(placeholder);

      const messageDiv = document.getElementById('message');
      messageDiv.before(container);
    }

    return document.getElementById('hours-info');
  }

  // Run on load and repeat every minute
  updateMaxHoursAllowed();
  setInterval(updateMaxHoursAllowed, 60 * 1000);
}