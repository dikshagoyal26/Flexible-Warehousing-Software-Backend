const UserModel = require("../models/usermodel"); //Schema
const appCodes = require("../../utils/appcodes"); //App codes
const tokenOperations = require("../../utils/token"); //Jwt token
const encryptOperations = require("../../utils/encrypt"); //password encryption
const sendMail = require("../../utils/mail"); //nodemailer

const userOperations = {
  add(userObject, response) {
    //register
    userObject.password = encryptOperations.encrypt(userObject.password);
    UserModel.create(userObject, (err) => {
      if (err) {
        console.log("Error in Record Add");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Added Due to Error"
        });
      } else {
        console.log("Record Added..");
        sendMail(userObject.userid, "register");

        response.status(appCodes.OK).json({
          status: appCodes.SUCCESS,
          message: "Record Added",
          userid: userObject.userid
        });
      }
    });
  },
  findid(userObject, response) {
    //search by id
    UserModel.findOne({ userid: userObject.userid }, (err, doc) => {
      if (err) {
        console.log("Error in Email Search");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Email Not Searched Due to Error"
        });
      } else {
        if (doc) {
          console.log("Email found");
          sendMail(userObject.userid, "reset");
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            userid: doc.userid,
            message: "A mail to reset pwd is sent"
          });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Userid "
          });
        }
      }
    });
  },
  finduser(userObject, response) {
    //search by id
    UserModel.findOne(userObject, (err, doc) => {
      if (err) {
        console.log("Error in Email Search");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Email Not Searched Due to Error"
        });
      } else {
        if (doc) {
          console.log("Record found");
          //sendMail(userObject.userid, "reset");
          response.status(appCodes.OK).json({
            status: appCodes.SUCCESS,
            userid: doc.userid,
            message: "Profile found",
            record: doc
          });
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Userid "
          });
        }
      }
    });
  },
  resetpwd(userObject, response) {
    //reset password
    console.log("reset pwd");
    userObject.password = encryptOperations.encrypt(userObject.password);
    UserModel.findOneAndUpdate(
      { userid: userObject.userid },
      { $set: { password: userObject.password } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Error in Record Update");
          response.status(appCodes.SERVER_ERROR).json({
            status: appCodes.ERROR,
            message: "Record not updated Due to Error"
          });
        } else {
          if (doc) {
            console.log("Record updated ");

            response.status(appCodes.OK).json({
              status: appCodes.SUCCESS,
              userid: doc.userid
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
  delteone(userObject, response) {
    //delete account
    UserModel.findOneAndRemove({ userid: userObject.userid }, (err) => {
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

  search(userObject, response) {
    //login
    UserModel.findOne({ userid: userObject.userid }, (err, doc) => {
      if (err) {
        console.log("Error in Record Search");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Searched Due to Error"
        });
      } else {
        if (doc) {
          console.log("record found");
          if (encryptOperations.compare(userObject.password, doc.password)) {
            var token = tokenOperations.generateToken({ userid: doc.userid });

            response.status(appCodes.OK).json({
              status: appCodes.SUCCESS,
              message: "Successfully Loggedin",
              token: token,
              userid: doc.userid
            });
          }
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid Userid or Password "
          });
        }
      }
    });
  },
  displayorders(userObject, response) {
    const orderModel = require("../models/order");
    orderModel.find({ userid: userObject.userid }, (err, doc) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          console.log("doc is", doc);
          var record = new Array();
          for (let i = 0; i < doc.length; i++) {
            const formModel = require("../models/b2cform");
            var users = null,
              vendors = null;
            formModel.find({ userid: doc[i].userid }, (err, user) => {
              if (err) {
                response.status(appCodes.SERVER_ERROR).json({
                  status: appCodes.ERROR,
                  message: "Error in DB During Find Operation"
                });
              } else {
                if (user) {
                  console.log("user is", user);
                  // var record = new Array();
                  users = user;
                } else {
                  response.status(appCodes.RESOURCE_NOT_FOUND).json({
                    status: appCodes.FAIL,
                    message: "Invalid Userid or Password "
                  });
                }
              }
            });
            const vendorModel = require("../models/vendor");
            vendorModel.findOne(
              { vendorid: doc[i].vendorid },
              (err, vendor) => {
                if (err) {
                  response.status(appCodes.SERVER_ERROR).json({
                    status: appCodes.ERROR,
                    message: "Error in DB During Find Operation"
                  });
                } else {
                  if (vendor) {
                    console.log("vendor is", vendor);
                    // var record = new Array();
                    vendors = vendor;
                  } else {
                    response.status(appCodes.RESOURCE_NOT_FOUND).json({
                      status: appCodes.FAIL,
                      message: "Invalid Userid or Password "
                    });
                  }
                }
              }
            );
            if (users != null && vendors != null) {
              record.push({
                orderid: doc[i].orderid,
                date: doc[i].date,
                vstartedpickup: doc[i].vstartedpickup,
                vreachedpickup: doc[i].vreachedpickup,
                vreachedpickup_client: doc[i].vreacheddest_client,
                vpicked: doc[i].vpicked,
                vpickedclient: doc[i].vpickedclient,
                vreacheddest: doc[i].vreacheddest,
                vreacheddest_client: doc[i].vreacheddest_client,
                vhanded: doc[i].vhanded,
                vhandedclient: doc[i].vhandedclient,
                _id: doc[i]._id,
                sessionId: doc[i].sessionId,
                vendorid: doc[i].vendorid,
                user: users,
                vendor: vendors,
                // when: data.date,
                // from: data.from,
                // to: data.to,
                // items: data.items,
                // boxes: data.boxes,
                // fromaddress: data.fromaddress,
                // toaddress: data.toaddress,
                userid: data.userid,
                name: data.name
              });
            }
            if (i == doc.length - 1 && users != null && vendors != null) {
              response.status(appCodes.OK).json({
                status: appCodes.SUCCESS,
                message: "orders ",
                record: record
              });
            }
          }
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
module.exports = userOperations;
