const express = require("express");
const passport = require("passport");

const userRoute = express.Router();
const userOperations = require("../db/helpers/usercrud");

//@route Post /user/register
//@desc Register users route
//@access Public
userRoute.post("/register", (req, res) => {
  let data = req.body;
  userOperations.add(data, res);
});

//@route Post /user/login
//@desc Login users route
//@access Public
userRoute.post("/login", (req, res) => {
  let data = req.body;
  userOperations.search(data, res);
});

//@route Post /user/findid
//@desc Search email users route
//@access Public
userRoute.post("/findid", (req, res) => {
  let data = req.body;
  userOperations.findid(data, res);
});
//@route Get /user/finduser
//@desc Search email users route
//@access Public
userRoute.get("/finduser", (req, res) => {
  let json = { userid: req.query.userid };
  userOperations.finduser(json, res);
});
//@route Post /user/resetpwd
//@desc Reset password users route
//@access Public
userRoute.put("/resetpwd", (req, res) => {
  let data = req.body;
  userOperations.resetpwd(data, res);
});

//@route Post /user/deleteone
//@desc Register users route
//@access Public
userRoute.delete("/deleteone", (req, res) => {
  let data = req.body;
  userOperations.delteone(data, res);
});

//@route Get /user/google
//@desc Register users google route
//@access Public
userRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//@route Get /user/dashboard
//@desc Register users google route
//@access Public
userRoute.get("/dashboard", passport.authenticate("google"), (req, res) => {
  console.log("Request ", req);

  const sendMail = require("../utils/mail"); //nodemailer
  sendMail(userObject.userid, "register");

  response
    .status(appCodes.OK)
    .json({ status: appCodes.SUCCESS, message: "Record Added" });
});
module.exports = userRoute;

// //@route Post /user//register
// //@desc Register users route
// //@access Public
// userRoute.get("/auth/facebook", passport.authenticate("facebook"));

// //@route Post /register
// //@desc Register users route
// //@access Public
// userRoute.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.render("welcome");
//   }
// );
// //@route Post /register
// //@desc Register users route
// //@access Public
// userRoute.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile"]
//   })
// );
// //@route Post /register
// //@desc Register users route
// //@access Public
// userRoute.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     res.render("welcome");
//   }
// );
