const crypto = require('crypto');

// Generate OTP of 6 digits
function generateOTP() {
  const otp = (crypto.randomBytes(4).readUInt32BE(0) % 900000) + 100000;
  return otp.toString();
}

module.exports = { generateOTP };
