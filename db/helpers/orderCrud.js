const orderModel = require("../models/order");
const appCodes = require("../../utils/appcodes");
const sendMail = require("../../utils/mail"); //nodemailer
//const sessionId = require("sessionId");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
const orderOperations = {
  add(orderObject, response) {
    //orderObject.sessionId = sess;
    orderObject.when = new Date(orderObject.when);
    orderObject.orderid = shortid.generate();
    console.log("date", orderObject.when);

    orderModel.create(orderObject, (err) => {
      if (err) {
        console.log("Error in Record Add", err);
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Added Due to Error"
        });
      } else {
        //console.log("Record Added..", orderObject);
        sendMail(orderObject.userid, "orderdone");
        // const nodecron = require("node-cron");
        sendMail(orderObject.vendorid, "orderdone");
        var schedule = require("node-schedule");

        var da = orderObject.when;
        console.log(da);
        var date = new Date(
          da.getFullYear(),
          da.getMonth(),
          da.getDate() - 1,
          da.getHours(),
          da.getMinutes(),
          da.getMilliseconds()
        );
        console.log(date);

        var j = schedule.scheduleJob(date, function() {
          console.log("The answer to life, the universe, and everything!");
          sendMail(orderObject.vendorid, "orderdone");
          sendMail(orderObject.userid, "orderdone");

          var rule = new schedule.RecurrenceRule();

          rule.hour = new schedule.Range(4, 24, 4);

          var j1 = schedule.scheduleJob(rule, function() {
            console.log(rule);
            console.log(
              "Today is recognized by Rebecca Black!---------------------------"
            );
            sendMail(orderObject.vendorid, "orderdone");
            if (Date.now() == da) j1.cancel();
          });
        });
        response.status(appCodes.OK).json({
          status: appCodes.SUCCESS,
          message: "Record Added",
          sessionId: orderObject.sessionId,
          orderid: orderObject.orderid
        });
      }
    });
  },
  update(orderObject, response) {
    orderModel.findOneAndUpdate(
      { sessionId: orderObject.sessionId },
      { $set: orderObject },
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
              sessionId: orderObject.sessionId,
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
  confirm(orderObject, response) {
    orderModel.find({ userid: orderObject.userid }, (err, doc) => {
      //match userid
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          // response.status(appCodes.OK).json({
          //   status: appCodes.SUCCESS,
          //   message: "order recorded for " + doc.userid,
          //   record: doc
          // });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Userid or Password "
          });
        }
      }
    });
  },
  delete(orderObject, response) {
    orderModel.findOneAndRemove({ _id: orderObject._id }, (err) => {
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
  search(orderObject, response) {
    orderModel
      .find(orderObject)
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
  },
  selectvendor(orderObject, response) {
    orderModel.findOne({ sessionId: orderObject.sessionId }, (err, user) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (user) {
          console.log(user);
          var volumesum = 0,
            calcWeight = 0,
            weightsum = 0;
          console.log("user.items.length is", user.items.length);
          for (let i = 0; i < user.items.length; i++) {
            // if (user.items[i].cdimension == "cm") {
            //   user.items[i].clength = user.items[i].clength ;
            //   user.items[i].cbreadth = user.items[i].cbreadth ;
            //   user.items[i].cheight = user.items[i].cheight ;
            //  // user.items[i].cdimension == "cm";
            // }
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
          vendorModel.find({}, (err, vendors) => {
            if (err) {
              response.status(appCodes.SERVER_ERROR).json({
                status: appCodes.ERROR,
                message: "Error in DB During Find Operation"
              });
            } else {
              if (vendors) {
                console.log("vendors is", vendors);
                for (var i = 0; i < vendors.length; i++) {
                  var diff = 0,
                    flag = 0,
                    flag2 = 0;
                  console.log(
                    "vendor capacity",
                    vendors[i].capacity,
                    "safety",
                    vendors[i].safetyfactor,
                    "calc",
                    calcWeight
                  );
                  diff =
                    vendors[i].capacity - vendors[i].safetyfactor - calcWeight;
                  console.log("diff is", diff);
                  if (diff > 0) {
                    for (
                      var y = 0, z = 0;
                      y < vendors[i].pickup_pincode.length ||
                      z < vendors[i].delivery_pincode.length;
                      z++, y++
                    ) {
                      if (
                        vendors[i].pickup_pincode[y] == user.fromaddress[0].pin
                      ) {
                        flag = 1;
                      }
                      if (
                        vendors[i].delivery_pincode[z] == user.toaddress[0].pin
                      ) {
                        flag2 = 1;
                      }
                      if (flag == 1 && flag2 == 1) {
                        varray.push(vendors[i]);
                        break;
                      }
                    }
                  }
                }
                console.log("varray is ", varray);
                response.status(appCodes.OK).json({
                  status: appCodes.SUCCESS,
                  message: "order recorded for " + user.userid,
                  record: user,
                  vendors: varray
                });
                // response.status(appCodes.OK).json({
                //   status: appCodes.SUCCESS,
                //   message: "vendor recorded for " + vendors.userid,
                //   record: vendors
                // });
              } else {
                response.status(appCodes.RESOURCE_NOT_FOUND).json({
                  status: appCodes.FAIL,
                  message: "Invalid Userid or Password "
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
module.exports = orderOperations;
