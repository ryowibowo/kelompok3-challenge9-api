const bcrypt = require('bcrypt');

const encrypt = (password) => bcrypt.hashSync(password, 10);

module.exports = {
  encrypt,
};
