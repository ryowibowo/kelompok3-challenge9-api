const bcrypt = require('bcrypt');

const checkPW = (password, encryptedPassword) => bcrypt.compareSync(password, encryptedPassword);

module.exports = {
  checkPW,
};
