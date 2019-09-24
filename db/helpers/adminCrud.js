const AdminModel = require("../models/admin");
const appCodes = require("../../utils/appcodes");
const encryptOperations = require("../../utils/encrypt");
const tokenOperations = require("../../utils/token");
const sendMail = require("../../utils/mail"); //nodemailer

const adminOperations = {
  register(adminObject, response) {
    //register
    adminObject.password = encryptOperations.encrypt(adminObject.password);
    adminModel.create(adminObject, (err) => {
      if (err) {
        console.log("Error in Record Add");
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Record Not Added Due to Error"
        });
      } else {
        console.log("Record Added..");
        sendMail(adminObject.adminid, "register");

        response.status(appCodes.OK).json({
          status: appCodes.SUCCESS,
          message: "Record Added",
          adminid: adminObject.adminid
        });
      }
    });
  },

  // login
  login(adminObject, response) {
    AdminModel.findOne({ adminid: adminObject.adminid }, (err, doc) => {
      if (err) {
        response.status(appCodes.SERVER_ERROR).json({
          status: appCodes.ERROR,
          message: "Error in DB During Find Operation"
        });
      } else {
        if (doc) {
          if (
            encryptOperations.compareHash(adminObject.password, doc.password) //match pwd
          ) {
            token = tokenOperations.generateToken({
              adminid: adminObject.adminid
            });
            response.status(appCodes.OK).json({
              status: appCodes.SUCCESS,
              message: "Welcome " + doc.adminid,
              record: {
                name: doc.name,
                isFirstTym: doc.isFirstTym,
                adminid: doc.adminid
              },
              token: token
            });
          } else {
            response.status(appCodes.RESOURCE_NOT_FOUND).json({
              status: appCodes.FAIL,
              message: "Invalid adminid or Password "
            });
          }
        } else {
          response.status(appCodes.RESOURCE_NOT_FOUND).json({
            status: appCodes.FAIL,
            message: "Invalid adminid or Password "
          });
        }
      }
    });
  },

  // to login first time and set new pwd(firsttym=true)
  updatepwd(adminObject, response) {
    adminObject.password = encryptOperations.encryptPassword(
      //password encryption
      adminObject.password
    );

    AdminModel.findOneAndUpdate(
      { adminid: adminObject.adminid },
      {
        $set: {
          password: adminObject.password,
          isFirstTym: false
        }
      },
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
              adminid: doc.adminid
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
  //to update details
  update(adminObject, response) {
    if (adminObject.newadminid) {
      adminid = adminObject.newadminid;
    } else {
      adminid = adminObject.adminid;
    }
    AdminModel.findOneAndUpdate(
      { adminid: adminObject.adminid },
      {
        $set: {
          adminid: adminid,
          name: adminObject.name,
          isFirstTym: true
        }
      },
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
              adminid: doc.adminid
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
  orders(response) {
    const orderModel = require("../models/order");
    orderModel.find({}, (err, doc) => {
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
module.exports = adminOperations;
