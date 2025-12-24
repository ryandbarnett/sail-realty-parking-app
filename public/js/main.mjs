import { setupFormHandlers } from './formHandler.mjs';
import { setupParkingAvailabilityChecker } from './parkingAvailability.mjs';

// 🎄 Auto-enable Christmas theme (Dec 24 – Jan 4)
(function enableChristmasTheme() {
  const now = new Date();

  const month = now.getMonth(); // 0 = Jan, 11 = Dec
  const day = now.getDate();

  const isChristmasRange =
    (month === 11 && day >= 24) || // Dec 24–31
    (month === 0 && day <= 4);     // Jan 1–4

  if (isChristmasRange) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/christmas.css';
    document.head.appendChild(link);
  }
})();

const form = document.getElementById('payment-form');
const messageDiv = document.getElementById('message');
const submitButton = form.querySelector('button');
const hoursInput = form.hours;

setupFormHandlers({ form, messageDiv, submitButton, hoursInput });
setupParkingAvailabilityChecker({ hoursInput });
