const express = require("express");

const formRoute = express.Router();
const formCrud = require("../db/helpers/formCrud");

//@route Post /form/add
//@desc add products to form route
//@access Private
formRoute.post("/add", (req, res) => {
 // sess = req.session;
  // sess.email = req.body.email;
 sess = req.sessionID
  console.log("req.body", req.body, "session", sess, "id", req.sessionID);
  const json = req.body;
  formCrud.add(json, res, sess);
});

//@route Get /form/search
//@desc search products in form route
//@access Private
formRoute.get("/search", (req, res) => {
  sess = req.session;

  console.log("req.body", req.body, "session", sess, "id", req.sessionID);

  // const userid = req.query.userid;
  let json = { uuid: req.query.uuid };
  formCrud.search(json, res);
});

// //@route Put /form/update
// //@desc Update form route
// //@access Private
formRoute.put("/update", (req, res) => {
  const json = req.body;
  console.log("data is", json);
  formCrud.update(json, res);
});

//@route Delete /form/delete
//@desc Delete product from form route
//@access Private
formRoute.delete("/deleteOne", (req, res) => {
  const json = req.body;
  formCrud.delete(json, res);
});

//@route Delete /form/delete
//@desc Delete product from form route
//@access Private
formRoute.delete("/deleteAll", (req, res) => {
  const json = req.body;
  formCrud.deleteAll(json, res);
});

formRoute.get("/selectvendor", (req, res) => {
  // const userid = req.query.userid;
  let json = { sessionId: req.query.sessionId };
  formCrud.selectvendor(json, res);
});
formRoute.put("/confirm", (req, res) => {
  const json = req.body;
  formCrud.confirm(json, res);
});
module.exports = formRoute;
