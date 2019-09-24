const connection = require("../connection");
const Schema = connection.Schema;
const UserSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  // userid: String,
  // name: String,
  // address: String,
  // city: String,
  // phone: String,
  // password: String,
  // pincode: String
});
const User = connection.model("Users", UserSchema);
module.exports = User;
