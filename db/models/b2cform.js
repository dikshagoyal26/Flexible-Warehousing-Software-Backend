const connection = require("../connection");
const Schema = connection.Schema;
const ItemSchema = new Schema({
  itemid: {
    type: String
  },
  name: {
    type: String
  },
  qty: {
    type: Number
  },
  select: {
    type: String
  },
  clength: {
    type: Number
  },
  cbreadth: {
    type: Number
  },
  cheight: {
    type: Number
  },
  cweight: {
    type: Number
  },
  cdimension: {
    type: String
  }
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "B2cforms"
  // }
});
const BoxSchema = new Schema({
  quantity: {
    type: Number
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
  dimension: {
    type: String
  }
});
const AddressFromSchema = new Schema({
  address: {
    type: String
  },
  locality: {
    type: String
  },
  landmark: {
    type: String
  },
  city: {
    type: String
  },
  pin: {
    type: Number
  },
  contact: {
    type: Number
  },
  elevator: {
    type: Boolean
  },
  pickuptime: {
    type: String
  }
});
const AddressToSchema = new Schema({
  address: {
    type: String
  },
  locality: {
    type: String
  },
  landmark: {
    type: String
  },
  city: {
    type: String
  },
  pin: {
    type: Number
  },
  contact: {
    type: Number
  },
  elevator: {
    type: Boolean
  }
});
const FormSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  userid: {
    type: String
  },
  name: {
    type: String
  },
  when: {
    type: Date
  },
  from: {
    type: String
  },
  to: {
    type: String
  },
  sessionId: {},
  items: {
    type: [ItemSchema],
    default: undefined
  },
  boxes: {
    type: [BoxSchema],
    default: undefined
  },
  fromaddress: {
    type: [AddressFromSchema],
    default: undefined
  },
  toaddress: {
    type: [AddressToSchema],
    default: undefined
  },

  status: {
    type: String
  }
});
const Form = connection.model("B2cforms", FormSchema);
module.exports = Form;
