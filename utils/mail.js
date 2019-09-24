var nodemailer = require("nodemailer");
var mailKeys = require("../config/mail");
function sendMail(userid, type) {
  if (type === "register") {
    template = require("../template/registertemplate")(userid);
    subjectdata = "Holisol Logistics";
  } else if (type === "reset") {
    template = require("../template/foregtTemplate")(userid);
    subjectdata = "Reset Password for Holisol";
  } else if (type === "orderdone") {
    template = require("../template/foregtTemplate");
    subjectdata = "Order Confirmed";
  }
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailKeys.user,
      pass: mailKeys.pass
    }
  });

  const mailOptions = {
    from: mailKeys.user, // sender address
    to: userid, // list of receivers
    subject: subjectdata, // Subject line
    html: template
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
module.exports = sendMail;
