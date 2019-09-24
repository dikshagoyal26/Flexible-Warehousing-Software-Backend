const formModel = require("../models/b2cform");
const orderModel = require("../models/order");

const appCodes = require("../../utils/appcodes");
const sendMail = require("../../utils/mail"); //nodemailer
//const sessionId = require("sessionId");
const formOperations = {
  add(formObject, response, sess) {
    formObject.sessionId = sess;
    formModel.create(formObject, (err) => {
      if (err) {
        console.log("Error in Record Add", err);
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Added Due to Error"
        });
      } else {
        console.log("Record Added..", formObject);
        //sendMail(formObject.userid, "form");

        response.status(appCodes.OK).json({
          status: appCodes.SUCCESS,
          message: "Record Added",
          sessionId: formObject.sessionId
        });
      }
    });
  },
  update(formObject, response) {
    formModel.findOneAndUpdate(
      { sessionId: formObject.sessionId },
      { $set: formObject },
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
              userid: doc.userid,
              sessionId: formObject.sessionId,
              message: "Record Updated",
              record: doc
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
  confirm(formObject, response) {
    formModel.findOneAndUpdate(
      { sessionId: formObject.sessionId },
      { $set: formObject },
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
            var orderObject = {
              user: doc.user,
              sessionId: formObject.sessionId,
              vendor: formObject.vendor
            };
            orderModel.create(orderObject, (err) => {
              if (err) {
                console.log("Error in Record Add", err);
                response.status(appCodes.SERVER_ERROR).json({
                  status: appCodes.ERROR,
                  message: "Record Not Added Due to Error"
                });
              } else {
                console.log("Record Added..", orderObject);
                //sendMail(doc.userid, "order");
              }
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
  delete(formObject, response) {
    formModel.findOneAndRemove({ _id: formObject._id }, (err) => {
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
  },
  search(formObject, response) {
    formModel.find({ sessionId: formObject.sessionId }, (err, doc) => {
      //match userid
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            message: "form recorded for " + doc.userid,
            record: doc
          });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Userid or Password "
          });
        }
      }
    });
  },
  selectvendor(formObject, response) {
    formModel.findOne(formObject, (err, user) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (user) {
          console.log(user);
          var volumesum = 0,
            weightsum = 0,
            calcWeight = 0;
          console.log("user.items.length is", user.items.length);
          for (let i = 0; i < user.items.length; i++) {
            if (user.items[i].cdimension == "inches") {
              user.items[i].clength = user.items[i].clength * 2.54;
              user.items[i].cbreadth = user.items[i].cbreadth * 2.54;
              user.items[i].cheight = user.items[i].cheight * 2.54;
              user.items[i].cdimension == "cm";
            }
            weightsum += user.items[i].qty * user.items[i].select;

            volumesum +=
              (user.items[i].qty *
                user.items[i].clength *
                user.items[i].cbreadth *
                user.items[i].cheight) /
              5000;
          }
          console.log("weightsum is", weightsum);
          console.log("volumesum is", volumesum);
          var varray = new Array();
          if (volumesum > weightsum) {
            calcWeight = volumesum;
          } else {
            calcWeight = weightsum;
          }

          console.log("calcWeight is ", calcWeight);
          const vendorModel = require("../models/vendor");

          vendorModel
            .find({})
            .populate("commvehicle.vehicle_id")
            .exec(function(err, vendors) {
              if (err) {
                response.status(appCodes.SERVER_ERROR).json({
                  status: appCodes.ERROR,
                  message: "Error in DB During Find Operation"
                });
              } else {
                if (vendors) {
                  var c = 0;
                  vendors.forEach((vendor) => {
                    var vehiarr = new Array();
                    console.log("entrrrrr", vendor);
                    vendor.commvehicle.forEach((vehicle) => {
                      console.log("entrrrrr loop", vehicle);

                      if (
                        vehicle.vehicle_id.capacity * 100000000 >=
                        calcWeight - vehicle.vehicle_id.safetyfactor
                      ) {
                        console.log("entrrrrr", vehicle);
                        var flag = (flag2 = 0);

                        for (
                          var y = 0, z = 0;
                          y < vehicle.pickup_pincode.length ||
                          z < vehicle.delivery_pincode.length;
                          z++, y++
                        ) {
                          if (
                            vehicle.pickup_pincode[y] == user.fromaddress[0].pin
                          ) {
                            flag = 1;
                          }
                          if (
                            vehicle.delivery_pincode[z] == user.toaddress[0].pin
                          ) {
                            flag2 = 1;
                          }
                          if (flag == 1 && flag2 == 1) {
                            if (vehiarr.length != 0) {
                              if (checkbasecharge > vehicle.basecharge) {
                                vehiarr.pop();
                                vehiarr.push(vehicle);
                              }
                            } else {
                              var checkbasecharge = vehicle.basecharge;
                              console.log(
                                "checkfixedcharge isssssssssssssssssssssssss",
                                vehicle.basecharge
                              );
                              vehiarr.push(vehicle);
                              console.log(
                                "*********select vehicle is*********",
                                vehiarr,
                                "************end*************"
                              );
                            }
                            break;
                          }
                        }
                      }
                    });
                    if (vehiarr != 0) {
                      varray.push({
                        vendor: vendor,
                        vehicle: vehiarr
                      });
                    }
                    if (c == vendors.length - 1) {
                      response.status(appCodes.OK).json({
                        status: appCodes.SUCCESS,
                        message: "form recorded ",
                        record: user,
                        vendors: varray
                      });
                    }

                    c++;
                  });
                  //console.log("data", data);
                  //order=data;
                } else {
                  response.status(appCodes.RESOURCE_NOT_FOUND).json({
                    status: appCodes.FAIL,
                    message: "Invalid details  "
                  });
                }
              }
            });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Userid or Password "
          });
        }
      }
    });
  }
};
module.exports = formOperations;
