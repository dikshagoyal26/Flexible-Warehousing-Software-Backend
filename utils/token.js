const jwt = require("jsonwebtoken");
const tokenOperations = {
  SECRETKEY: "UCANTSEEME",
  generateToken(userid) {
    var token = jwt.sign({ userid }, this.SECRETKEY, { expiresIn: "1200" });
    return token;
  },
  verifyToken(clientTokenNumber) {
    var decoded = jwt.verify(clientTokenNumber, this.SECRETKEY);
    if (decoded) {
      console.log("Verified ", decoded.userid);
    } else {
      console.log("Token Not Matched...");
    }
  }
};

module.exports = tokenOperations;
