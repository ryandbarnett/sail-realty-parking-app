import { setupFormHandlers } from './formHandler.mjs';
import { setupParkingAvailabilityChecker } from './parkingAvailability.mjs';

const form = document.getElementById('payment-form');
const messageDiv = document.getElementById('message');
const submitButton = form.querySelector('button');
const hoursInput = form.hours;

setupFormHandlers({ form, messageDiv, submitButton, hoursInput });
setupParkingAvailabilityChecker({ hoursInput });