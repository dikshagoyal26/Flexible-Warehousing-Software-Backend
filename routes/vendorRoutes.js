const express = require("express");

const vendorRoute = express.Router();
const vendorOperations = require("../db/helpers/vendorcrud");

//@route Post /vendor/register
//@desc  vendors register route
//@access Private
vendorRoute.post("/register", (req, res) => {
  let data = req.body;
  vendorOperations.register(data, res);
});

//@route Post /vendor/login
//@desc Login vendors route
//@access Public
vendorRoute.post("/login", (req, res) => {
  let data = req.body;
  vendorOperations.login(data, res);
});

// //@route Put /vendor/update
// //@desc Update vendor route
// //@access Private
vendorRoute.put("/update", (req, res) => {
  const json = req.body;
  console.log("data is", json);
  vendorOperations.update(json, res);
});

//@route Get /vendor/searchvendor
//@desc vendors details route
//@access Private
vendorRoute.get("/searchvendor", (req, res) => {
  let data = { vendorid: req.query.vendorid };
  vendorOperations.searchvendor(data, res);
});

//@route Get /vendor/search
//@desc vendors details route
//@access Private
vendorRoute.get("/search", (req, res) => {
  let data = req.body;
  vendorOperations.search(data, res);
});

//@route Get /vendor/searchorders
//@desc vendors details route
//@access Private
vendorRoute.get("/searchorders", (req, res) => {
  let json = { vendorid: req.query.vendorid };

  vendorOperations.searchorders(json, res);
});

module.exports = vendorRoute;
