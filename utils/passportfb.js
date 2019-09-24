const passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: "329899957707215",
      clientSecret: "9793604016e469611384a12c2e3c7aa0",
      callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(
        "Passport amazon Call Back Function.... AccessToken " +
          accessToken +
          " Ref " +
          refreshToken +
          " Profile ",
        profile,
        "Done ",
        done
      );
      return done(null, { token: accessToken, profile: profile });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
