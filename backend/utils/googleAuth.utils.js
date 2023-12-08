const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require('passport');
const config = require("../config/config")

passport.use(new GoogleStrategy({
    clientID:  config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:1010/api/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // await User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
     done(null,profile)
  })
);

passport.serializeUser((user,done)=>{
       done(null,user);
})

passport.deserializeUser((user,done)=>{
       done(null,user)
})