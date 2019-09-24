const express = require("express");

const orderRoute = express.Router();
const orderCrud = require("../db/helpers/orderCrud");

//@route Post /orders/add
//@desc add orders to order route
//@access Private
orderRoute.post("/add", (req, res) => {
  const json = req.body;
  //console.log("data is", json);
  orderCrud.add(json, res);
});

//@route Get /orders/search
//@desc search orders in order route
//@access Private
orderRoute.get("/search", (req, res) => {
  let json = { userid: req.query.userid };
  orderCrud.search(json, res);
});

// //@route Put /orders/update
// //@desc Update order route
// //@access Private
orderRoute.put("/update", (req, res) => {
  const json = req.body;
  console.log("data is", json);
  orderCrud.update(json, res);
});

//@route Delete /orders/delete
//@desc Delete product from order route
//@access Private
orderRoute.delete("/deleteOne", (req, res) => {
  const json = req.body;
  orderCrud.delete(json, res);
});

//@route Delete /order/delete
//@desc Delete product from order route
//@access Private
orderRoute.delete("/deleteAll", (req, res) => {
  const json = req.body;
  orderCrud.deleteAll(json, res);
});

orderRoute.get("/selectvendor", (req, res) => {
  // const userid = req.query.userid;
  let json = { sessionId: req.query.sessionId };
  orderCrud.selectvendor(json, res);
});
orderRoute.put("/confirm", (req, res) => {
  const json = req.body;
  orderCrud.confirm(json, res);
});
module.exports = orderRoute;
