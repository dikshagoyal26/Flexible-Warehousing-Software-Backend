const mongoose = require("mongoose");
const url = require("../config/env");
mongoose.connect(url.db);
module.exports = mongoose;
