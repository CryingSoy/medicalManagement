let crypto = require('crypto');

module.exports = function (password, algorithm) {
  let cryptos = crypto.createHash(algorithm);
  let cryptoPassword = cryptos.update(password).digest('base64');
  return cryptoPassword;
}