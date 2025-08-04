export function setupFormHandlers({ form, messageDiv, submitButton, hoursInput, navigate = defaultNavigate }) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const licensePlate = form.querySelector('[name="licensePlate"]').value.trim();
    const hours = parseInt(form.querySelector('[name="hours"]').value);

    if (!licensePlate) {
      displayMessage('Please enter a valid license plate.', messageDiv);
      submitButton.disabled = false;
      return;
    }

    if (hours < 1) {
      displayMessage('You must purchase at least 1 hour of parking.', messageDiv);
      submitButton.disabled = false;
      return;
    }

    if (hoursInput.disabled) {
      displayMessage('Parking is not currently allowed.', messageDiv);
      submitButton.disabled = false;
      return;
    }

    submitButton.disabled = true;

    try {
      const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate, hours }),
      });

      const data = await res.json();

      if (data.error) {
        displayMessage(data.error, messageDiv);
        submitButton.disabled = false;
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        navigate(data.url);
        return;
      }
    } catch (err) {
      console.error(err);
      displayMessage('An error occurred. Please try again.', messageDiv);
      submitButton.disabled = false;
    }
  });
}

function defaultNavigate(url) {
  window.location.href = url;
}

function displayMessage(message, target) {
  target.textContent = message;
}