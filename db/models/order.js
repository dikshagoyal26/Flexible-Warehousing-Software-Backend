const connection = require("../connection");
const shortid = require("shortid");
const Schema = connection.Schema;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

const OrderSchema = new Schema({
  orderid: {
    type: String,
    //default: shortid.generate()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  when: {
    //type: Date()
  },
  userid: {
    type: String
  },
  form_id: {
    type: Schema.Types.ObjectId,
    ref: "B2cforms"
  },
  vendor_id: {
    type: Schema.Types.ObjectId,
    ref: "vendors"
  },
  vehicle_id: {
    type: Schema.Types.ObjectId,
    ref: "vehicles"
  },
  vehicle: {
    vehicleid: {
      type: String,
      //unique: true,
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
    cost: {
      type: Number
    },
    typeOfCharge: {
      type: String
    },
    baseCharge: {
      type: Number
    },
    variableCharge: {
      type: Number
    },
    safetyfactor: {
      type: Number
    },
    perKmCharge: {
      type: Number
    }
  },
  warehouse: {
    type: Object,
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
  },

  vendorid: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  sessionId: { type: String },
  vstartedpickup: {
    type: Boolean,
    default: false
  },
  vreachedpickup: {
    type: Boolean,
    default: false
  },
  vreachedpickup_client: {
    type: Boolean,
    default: false
  },
  vpicked: {
    type: Boolean,
    default: false
  },
  vpickedclient: {
    type: Boolean,
    default: false
  },
  vreacheddest: {
    type: Boolean,
    default: false
  },
  vreacheddest_client: {
    type: Boolean,
    default: false
  },
  vhanded: {
    type: Boolean,
    default: false
  },
  vhandedclient: {
    type: Boolean,
    default: false
  },
  status: {
    type: String
  },
  total: {
    type: Number
  }
});
const Form = connection.model("orders", OrderSchema);
module.exports = Form;
