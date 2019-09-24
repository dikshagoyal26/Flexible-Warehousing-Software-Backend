const express = require("express");

const vehicleRoute = express.Router();
const vehicleCrud = require("../db/helpers/vehicleCrud");
const VehicleModel = require("../db/models/vehicle");
const appCodes = require("../utils/appcodes");
//@route Post /vehicle/add
//@desc add products to vehicle route
//@access Private
vehicleRoute.post("/add", (req, res) => {
  const json = req.body;
  vehicleCrud.add(json, res);
});

//@route Get /vehicle/search
//@desc search vehicles in vehicle route
//@access Private
vehicleRoute.get("/search", (req, res) => {
  vehicleCrud.search(res);
});

// //@route Put /vehicle/update
// //@desc Update vehicle route
// //@access Private
vehicleRoute.put("/update", (req, res) => {
  const json = req.body;
  vehicleCrud.update(json, res);
});

//@route Delete /vehicle/delete
//@desc Delete vehicle from vehicle route
//@access Private
vehicleRoute.delete("/deleteOne", (req, res) => {
  const json = req.body;
  vehicleCrud.delete(json, res);
});

// vehicleRoute.get("/searchone", (req, response) => {
//   VehicleModel.findOne({ _id: req.query._id }, (err, doc) => {
//     if (err) {
//       response.status(appCodes.SERVER_ERROR).json({
//         status: appCodes.ERROR,
//         message: "Error in DB During Find Operation"
//       });
//     } else {
//       if (doc) {
//         response.status(appCodes.OK).json({
//           status: appCodes.SUCCESS,
//           message: "vehicle recorded for " + doc.vehicleid,
//           record: doc
//         });
//       } else {
//         response.status(appCodes.RESOURCE_NOT_FOUND).json({
//           status: appCodes.FAIL,
//           message: "Invalid vehicleid  "
//         });
//       }
//     }
//   });
// });
module.exports = vehicleRoute;
