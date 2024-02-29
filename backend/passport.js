// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: "1045969688310-3uv1qrdud5qi30ekq36f4e459f30rds0.apps.googleusercontent.com",
//     clientSecret: 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,
//     callbackURL: "auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));