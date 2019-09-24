const GoogleStrategy = require("passport-google-oauth2");
const passport = require("passport");
const connection = require("../db/connection");
const User = require("../db/models/usermodel");
const googleAuth = require("../config/auth");
passport.serializeUser((user, done) => {
  // this is call when u write data in cookie
  var error = null;
  done(error, user);
});

passport.deserializeUser((userid, done) => {
  // this is call when u read data from cookie
  console.log("User session ", userid);
  User.findById(userid).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/dashboard",
      clientID: googleAuth.clientID,
      clientSecret: googleAuth.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(
        "callback google....profile is ",
        profile,
        " token is ",
        accessToken,
        " refreshToken is ",
        refreshToken,
        " done is ",
        done
      );

      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          console.log("user exist");
          done(null, currentUser); //call serialize
        } else {
          var userObject = new User({
            googleId: profile.id,
            username: profile._json.name,
            picture: profile._json.picture,
            email: profile._json.email
          });
          userObject.save().then(newUser => {
            console.log("New User Added...");

            done(null, newUser);
          });
        }
      });
    }
  )
);
