const connection = require("../connection");
const Schema = connection.Schema;
const ItemSchema = new Schema({
  itemid: {
    type: String,
    unique: true
    //required: true
  },
  name: {
    type: String
    //required: true
  },
  select: {
    type: String
    //default: null
    //required: true
  },

  // variant: {
  //   type: [String]
  //   //required: true
  // },
  variant: [
    {
      clength: {
        type: Number
        //required: true
      },
      cbreadth: {
        type: Number
        //required: true
      },
      cheight: {
        type: Number
        //required: true
      },
      cweight: {
        type: Number
        //required: true
      },
      cdimension: {
        type: String
        //required: true
      },
      weightunit: {
        type: String
        //required: true
      }
    }
  ],
  qty: {
    type: Number,
    default: 1
  },

  image: {
    type: String
    //required: true
  }
});

const Form = connection.model("items", ItemSchema);
module.exports = Form;
