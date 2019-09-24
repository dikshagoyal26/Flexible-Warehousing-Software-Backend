const connection = require("../connection");
const Schema = connection.Schema;

const VehicleSchema = new Schema({
  vehicleid: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String
  },
  capacity: {
    type: Number
  },
  unit: {
    type: String
  },
  length: {
    type: Number
  },
  breadth: {
    type: Number
  },
  height: {
    type: Number
  },
  safetyfactor: {
    type: Number,
    default: 50
  }
  // size:{

  // }
});
const Vendor = connection.model("vehicles", VehicleSchema);
module.exports = Vendor;
