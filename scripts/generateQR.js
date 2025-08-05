// scripts/generateQR.js
const QRCode = require('qrcode');
const url = 'https://sail-realty-parking-app.onrender.com/';

QRCode.toFile('public/images/sail-parking-qr.png', url, {
  color: {
    dark: '#000', // QR code color
    light: '#FFF' // Background color
  }
}, (err) => {
  if (err) throw err;
  console.log('✅ QR code saved as public/images/sail-parking-qr.png');
});