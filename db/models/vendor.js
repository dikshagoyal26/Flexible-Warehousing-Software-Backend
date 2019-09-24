const connection = require("../connection");
const Schema = connection.Schema;

const VendorSchema = new Schema({
  vendorid: {
    type: String,
    unique: true,
    required: true
  },
  vendorname: {
    type: String
  },
  password: {
    type: String
  },
  bname: {
    type: String
  },
  vaddress: {
    type: String
  },
  vlocality: {
    type: String
  },
  vlandmark: {
    type: String
  },
  vcity: {
    type: String
  },
  vpin: {
    type: Number
  },
  vcontact: {
    type: Number
  },
  altcontact: {
    type: Number
  },
  gstin: {
    type: String
  },
  commvehicle: [
    {
      vehicle_id: {
        type: Schema.Types.ObjectId,
        ref: "vehicles"
      },
      qty: {
        type: Number
      },

      basecharge: {
        type: Number
      },
      variablecharge: {
        type: Number
      },

      pickup_pincode: {
        type: [Number]
      },
      delivery_pincode: {
        type: [Number]
      }
    }
  ],
  warehouses: [
    {
      space: {
        type: String
      },
      owner: {
        type: String
      },
      cost: {
        type: String
      },
      time: {
        type: String
      }
    }
  ],
  // cost: {
  //   type: Number
  // },

  availability: {
    type: String
  }
});
const Vendor = connection.model("vendors", VendorSchema);
module.exports = Vendor;
