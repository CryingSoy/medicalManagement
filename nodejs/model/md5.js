let crypto = require('crypto');

module.exports = function (password) {
  let md5 = crypto.createHash('md5');
  let md5Password = md5.update(password).digest('base64');
  return md5Password;
}