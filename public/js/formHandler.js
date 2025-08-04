export function setupFormHandlers({ form, messageDiv, submitButton, hoursInput }) {
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

    if (!licensePlate || hours < 1 || hoursInput.disabled) {
      messageDiv.textContent = hoursInput.disabled
        ? 'Parking is not allowed at this time.'
        : 'Please enter a valid license plate and at least 1 hour.';
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
}