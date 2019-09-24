const express = require("express");

const adminRoute = express.Router();
const adminCrud = require("../db/helpers/adminCrud");

//@route Post /admin/register
//@desc Register to admin route
//@access Private
adminRoute.post("/register", (req, res) => {
  const json = req.body;
  adminCrud.register(json, res);
});

//@route Get /admin/login
//@desc Login admins in admin route
//@access Private
adminRoute.get("/login", (req, res) => {
  adminCrud.search(res);
});

// //@route Put /admin/update
// //@desc Update admin route
// //@access Private
adminRoute.put("/update", (req, res) => {
  const json = req.body;
  adminCrud.update(json, res);
});

// //@route Get /admin/update
// //@desc Get all orders list admin route
// //@access Private
adminRoute.get("/vieworders", (req, res) => {
  //const json = req.body;
  adminCrud.orders(res);
});

// //@route Delete /admin/delete
// //@desc Delete admin from admin route
// //@access Private
// adminRoute.delete("/deleteOne", (req, res) => {
//     const json = req.body;
//     adminCrud.delete(json, res);
// });

module.exports = adminRoute;
