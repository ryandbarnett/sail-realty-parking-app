import { setupFormHandlers } from './formHandler.js';
import { setupParkingAvailabilityChecker } from './parkingAvailability.js';

const form = document.getElementById('payment-form');
const messageDiv = document.getElementById('message');
const submitButton = form.querySelector('button');
const hoursInput = form.hours;

setupFormHandlers({ form, messageDiv, submitButton, hoursInput });
setupParkingAvailabilityChecker({ hoursInput });