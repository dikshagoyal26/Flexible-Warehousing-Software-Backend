const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const googleSetup = require("./utils/googlepassport");
const passport = require("passport");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "thisisthesecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
  })
);
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());
app.use(passport.session());
app.use(require("./utils/cors")); //CORS File
app.use("/user", require("./routes/userRoutes")); //User Routes
app.use("/admin", require("./routes/adminRoutes"));

app.use("/form", require("./routes/formRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

app.use("/vehicle", require("./routes/vehicleRoutes"));
app.use("/items", require("./routes/itemRoutes"));

app.use("/vendor", require("./routes/vendorRoutes"));

app.get("/dashboard", (req, res) => {
  res.json("hello user");
});
app.listen(process.env.PORT || 5000, (err) => {
  //Server
  if (err) {
    console.log("Error on Server Start ", err);
    throw err;
  }
});
