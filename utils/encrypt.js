const bcrypt = require("bcrypt");

const encryptOperations = {
  saltRounds: 10,

  encrypt(password) {
    var hash = bcrypt.hashSync(password, this.saltRounds);
    return hash;
  },
  compare(password, hash) {
    var boolean = bcrypt.compareSync(password, hash);
    return boolean;
  }
};
module.exports = encryptOperations;
