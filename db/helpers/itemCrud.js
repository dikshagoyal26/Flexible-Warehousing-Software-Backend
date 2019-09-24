const ItemModel = require("../models/items");
const appCodes = require("../../utils/appcodes");

const itemOperations = {
  add(itemObject, response) {
    ItemModel.create(itemObject, (err) => {
      if (err) {
        console.log("Error in Record Add", err);
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Added Due to Error"
        });
      } else {
        console.log("Record Added..");
        response
          .status(appCodes.OK)
          .json({ status: appCodes.SUCCESS, message: "Record Added" });
      }
    });
  },

  search(response) {
    ItemModel.find({}, (err, doc) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            message: "item recorded for " + doc.itemid,
            record: doc
          });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid itemid  "
          });
        }
      }
    });
  },
  update(itemObject, response) {
    ItemModel.findOneAndUpdate(
      { itemid: itemObject.itemid },
      { $set: itemObject },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Error in Record Update", err);
          response.status(appCodes.SERVER_ERROR).json({
            status: appCodes.ERROR,
            message: "Record not updated Due to Error"
          });
        } else {
          if (doc) {
            console.log("Record updated ");

            response.status(appCodes.OK).json({
              status: appCodes.SUCCESS,
              itemid: itemObject.itemid,
              message: "Record Updated"
            });
          } else {
            response.status(appCodes.RESOURCE_NOT_FOUND).json({
              status: appCodes.FAIL,
              message: "Invalid Details "
            });
          }
        }
      }
    );
  },
  delteone(itemObject, response) {
    //delete account
    ItemModel.findOneAndRemove({ itemid: itemObject.itemid }, (err) => {
      if (err) {
        response.status(appCodes.RESOURCE_NOT_FOUND).json({
          status: appCodes.FAIL,
          message: "Error in record delete "
        });
      } else {
        console.log("Record Deleted");
        response.status(appCodes.OK).json({
          status: appCodes.SUCCESS,
          message: "Record Deleted"
        });
      }
    });
  }
};
module.exports = itemOperations;
