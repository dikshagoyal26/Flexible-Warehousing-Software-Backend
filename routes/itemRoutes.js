const express = require("express");

const itemRoute = express.Router();
const itemCrud = require("../db/helpers/itemCrud");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
//@route Post /items/add
//@desc add products to item route
//@access Private
itemRoute.post("/add", upload.single("image"), (req, res) => {
  // console.log(req.file);
  //const json = req.body;
  const json = {
    name: req.body.name,
    select: req.body.select,
    clength: req.body.clength,
    cbreadth: req.body.cbreadth,
    cheight: req.body.cheight,
    cweight: req.body.cweight,
    cdimension: req.body.cdimension,
    variant: req.body.variant,
    qty: req.body.qty,
    weightunit: req.body.weightunit,
    image: req.file.path,
    itemid: req.body.itemid
  };
  itemCrud.add(json, res);
});

//@route Get /items/search
//@desc search items in item route
//@access Private
itemRoute.get("/search", (req, res) => {
  itemCrud.search(res);
});

// //@route Put /items/update
// //@desc Update item route
// //@access Private
itemRoute.put("/update", (req, res) => {
  const json = req.body;
  itemCrud.update(json, res);
});

//@route Delete /items/deleteOne
//@desc Delete item from item route
//@access Private
itemRoute.delete("/deleteOne", (req, res) => {
  const json = req.body;
  itemCrud.delete(json, res);
});

module.exports = itemRoute;
