const VehicleModel = require("../models/vehicle");
const appCodes = require("../../utils/appcodes");

const vehicleOperations = {
  add(vehicleObject, response) {
    VehicleModel.create(vehicleObject, (err) => {
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
    VehicleModel.find({}, (err, doc) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            message: "vehicle recorded for " + doc.vehicleid,
            record: doc
          });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid vehicleid  "
          });
        }
      }
    });
  },
  update(vehicleObject, response) {
    VehicleModel.findOneAndUpdate(
      { vehicleid: vehicleObject.vehicleid },
      { $set: vehicleObject },
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
              vehicleid: vehicleObject.vehicleid,
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
  delteone(vehicleObject, response) {
    //delete account
    VehicleModel.findOneAndRemove(
      { vehicleid: vehicleObject.vehicleid },
      (err) => {
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
      }
    );
  }
};
module.exports = vehicleOperations;
