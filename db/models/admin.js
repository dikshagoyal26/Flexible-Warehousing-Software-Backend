const connection = require("../connection");
const Schema = connection.Schema;

const AdminSchema = new Schema({
  adminid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const Vendor = connection.model("admins", AdminSchema);
module.exports = Vendor;
