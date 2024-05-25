const crypto = require('crypto');

function generateSecretKey() {
  return crypto.randomBytes(32).toString('base64');
}

console.log(generateSecretKey());
