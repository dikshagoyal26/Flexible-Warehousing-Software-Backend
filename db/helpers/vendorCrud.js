const vendorModel = require("../models/vendor");
const formModel = require("../models/b2cform");

const orderModel = require("../models/order");
const appCodes = require("../../utils/appcodes");
const tokenOperations = require("../../utils/token"); //Jwt token
const encryptOperations = require("../../utils/encrypt"); //password encryption
const sendMail = require("../../utils/mail"); //nodemailer

const vendorOperations = {
  register(vendorObject, response) {
    vendorObject.password = encryptOperations.encrypt(vendorObject.password);

    vendorModel.create(vendorObject, (err, doc) => {
      if (err) {
        console.log("Error in Record Add", err);
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Added Due to Error"
        });
      } else {
        if (doc) {
          console.log("Record Added..");
          var token = tokenOperations.generateToken({
            vendorid: doc.vendorid
          });
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            message: "Record Added",
            vendorid: vendorObject.vendorid,
            token: token
          });
        }
      }
    });
  },
  login(vendorObject, response) {
    //login
    vendorModel.findOne({ vendorid: vendorObject.vendorid }, (err, doc) => {
      if (err) {
        console.log("Error in Record Search");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Searched Due to Error"
        });
      } else {
        if (doc) {
          console.log("record found");
          if (encryptOperations.compare(vendorObject.password, doc.password)) {
            var token = tokenOperations.generateToken({
              vendorid: doc.vendorid
            });

            response.status(appCodes.OK).json({
              status: appCodes.SUCCESS,
              message: "Successfully Loggedin",
              token: token,
              vendorid: doc.vendorid,
              record: doc
            });
          }
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid vendorid or Password "
          });
        }
      }
    });
  },
  update(vendorObject, response) {
    console.log("vendorobject is", vendorObject.vendorid);
    vendorModel.findOne({ vendorid: vendorObject.vendorid }, (err, doc) => {
      if (err) {
        console.log("Error in Email Search");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Email Not Searched Due to Error"
        });
      } else {
        if (doc) {
          console.log("Email found");
          vendorModel.findOneAndUpdate(
            { vendorid: vendorObject.vendorid },
            { $set: vendorObject },
            { upsert: true },
            (err, doc) => {
              if (err) {
                console.log("Error in Record Update", err);
                response.status(appCodes.SERVER_ERROR).json({
                  status: appCodes.ERROR,
                  message: "Record not updated Due to Error"
                });
              } else {
                if (doc) {
                  console.log("Record Deleted ");

                  response.status(appCodes.OK).json({
                    status: appCodes.SUCCESS,
                    vendorid: doc.vendorid
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
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Password "
          });
        }
      }
    });
  },
  search(vendorObject, response) {
    vendorModel.find({}, (err, doc) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            message: "vendor recorded for " + doc.vendorid,
            record: doc
          });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid vendorid or Password "
          });
        }
      }
    });
  },
  searchvendor(vendorObject, response) {
    vendorModel.findOne({ vendorid: vendorObject.vendorid }, (err, doc) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          console.log("doc is", doc);
          var vehiclearr = new Array();
          // var record = new Array();
          console.log("doc length is", doc.commvehicle.length);

          for (let i = 0; i < 1; i++) {
            for (let j = 0; j < doc.commvehicle.length; j++) {
              const vehicleModel = require("../models/vehicle");
              vehicleModel.findOne(
                { _id: doc.commvehicle[j].vehicle_id },
                (err, data) => {
                  if (err) {
                    response.status(appCodes.SERVER_ERROR).json({
                      status: appCodes.ERROR,
                      message: "Error in DB During Find Operation"
                    });
                  } else {
                    if (data) {
                      vehiclearr.push({
                        vehicleid: data.vehicleid,
                        name: data.name,
                        capacity: data.capacity,
                        unit: data.unit,
                        length: data.length,
                        breadth: data.breadth,
                        height: data.height,
                        qty: doc.commvehicle[j].qty,
                        cost: doc.commvehicle[j].cost,
                        typeOfCharge: doc.commvehicle[j].typeOfCharge,
                        baseCharge: doc.commvehicle[j].baseCharge,
                        variableCharge: doc.commvehicle[j].variableCharge,
                        safetyfactor: doc.commvehicle[j].safetyfactor,
                        perKmCharge: doc.commvehicle[j].perKmCharge
                      });
                      console.log("vehicle arr is", vehiclearr);
                      if (j == doc.commvehicle.length - 1 && data != null) {
                        response.status(appCodes.OK).json({
                          status: appCodes.SUCCESS,
                          message: "Orders  ",
                          record: doc,
                          commvehicle: vehiclearr
                        });
                      }
                    }
                  }
                }
              );
            }
            // if (i == 0) {
            //   // response.status(appCodes.OK).json({
            //   //   status: appCodes.SUCCESS,
            //   //   message: "Orders  ",
            //   //   record: doc,
            //   //   commvehicle: vehiclearr
            //   // });
            // }
          }
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid vendorid or Password "
          });
        }
      }
    });
  },
  searchorders(vendorObject, response) {
    console.log("vendorobj is", vendorObject);
    //var order;
    orderModel
      .find(vendorObject)
      .populate("form_id")
      .exec(function(err, data) {
        if (err) {
          response.status(appCodes.SERVER_ERROR).json({
            status: appCodes.ERROR,
            message: "Error in DB During Find Operation"
          });
        } else {
          if (data) {
            console.log("data", data);
            //order=data;
          } else {
            response.status(appCodes.RESOURCE_NOT_FOUND).json({
              status: appCodes.FAIL,
              message: "Invalid details  "
            });
          }
        }
      });
    // orderModel.find(vendorObject, (err, doc) => {
    //   if (err) {
    //     response.status(appCodes.SERVER_ERROR).json({
    //       status: appCodes.ERROR,
    //       message: "Error in DB During Find Operation"
    //     });
    //   } else {
    //     if (doc) {
    //       console.log("doc is", doc);
    //       var record = new Array();
    //       for (let i = 0; i < doc.length; i++) {
    //         const formModel = require("../models/b2cform");
    //         formModel.findOne({ sessionId: doc[i].sessionId }, (err, data) => {
    //           //match userid
    //           if (err) {
    //             response.status(appCodes.SERVER_ERROR).json({
    //               status: appCodes.ERROR,
    //               message: "Error in DB During Find Operation"
    //             });
    //           } else {
    //             if (data) {
    //               console.log("data is", data);
    //               record.push({
    //                 orderid: doc[i].orderid,
    //                 date: doc[i].date,
    //                 vstartedpickup: doc[i].vstartedpickup,
    //                 vreachedpickup: doc[i].vreachedpickup,
    //                 vreachedpickup_client: doc[i].vreacheddest_client,
    //                 vpicked: doc[i].vpicked,
    //                 vpickedclient: doc[i].vpickedclient,
    //                 vreacheddest: doc[i].vreacheddest,
    //                 vreacheddest_client: doc[i].vreacheddest_client,
    //                 vhanded: doc[i].vhanded,
    //                 vhandedclient: doc[i].vhandedclient,
    //                 _id: doc[i]._id,
    //                 sessionId: doc[i].sessionId,
    //                 vendorid: doc[i].vendorid,
    //                 when: data.date,
    //                 from: data.from,
    //                 to: data.to,
    //                 items: data.items,
    //                 boxes: data.boxes,
    //                 fromaddress: data.fromaddress,
    //                 toaddress: data.toaddress,
    //                 userid: data.userid,
    //                 name: data.name
    //               });
    //               if (i == doc.length - 1 && data != null) {
    //                 response.status(appCodes.OK).json({
    //                   status: appCodes.SUCCESS,
    //                   message: "orders for " + vendorObject.vendorid,
    //                   record: record
    //                 });
    //               }
    //             } else {
    //               response.status(appCodes.RESOURCE_NOT_FOUND).json({
    //                 status: appCodes.FAIL,
    //                 message: "Invalid Userid or Password "
    //               });
    //             }
    //           }
    //         });
    //       }
    //     } else {
    //       response.status(appCodes.RESOURCE_NOT_FOUND).json({
    //         status: appCodes.FAIL,
    //         message: "Invalid vendorid or Password "
    //       });
    //     }
    //   }
    // });
  }
};
module.exports = vendorOperations;
