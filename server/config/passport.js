const JwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");

module.exports = (passport) => {
  // passport serialize
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  // JWT
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );

  // Google access token
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      function (accessToken, refreshToken, profile, done) {
        let { email } = profile._json;
        User.findOne({ email }, (err, user) => {
          if (err) {
            done(err, false);
          }

          // 如果是新用戶 就註冊
          if (!user) {
            let newUser = new User({
              email: profile._json.email,
              password: "00000000",
              googleId: profile.id,
            });

            newUser
              .save()
              .then((msg) => {
                let { _id, email } = msg;
                const tokenObject = { _id, email };
                const token = jwt.sign(
                  tokenObject,
                  process.env.PASSPORT_SECRET
                );

                done(null, {
                  seccess: true,
                  token: "JWT " + token,
                  user: msg,
                });
              })
              .catch((err) => {
                done(null, {
                  seccess: false,
                  user: err,
                });
              });
          }

          // 如果已註冊過且有googleId，就登入
          else if (user && user.googleId === profile.id) {
            const tokenObject = { _id: user._id, email: user.email };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

            done(null, {
              seccess: true,
              token: "JWT " + token,
              user,
            });
          }

          // 如果有此email 卻沒有googleId，但表已被local註冊過
          else {
            done(null, {
              seccess: false,
              message: "此Google帳號的email已被註冊過囉！",
            });
          }
        });
      }
    )
  );

  // facebook login
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        fbGraphVersion: "v3.0",
      },
      function (accessToken, refreshToken, profile, done) {
        let email = profile.emails[0].value;
        User.findOne({ email }, async function (err, user) {
          if (err) {
            done(err, false);
          }

          // 如果是新用戶 就註冊
          if (!user) {
            let newUser = new User({
              email,
              password: "00000000",
              facebookId: profile.id,
            });

            newUser
              .save()
              .then((msg) => {
                let { _id, email } = msg;
                const tokenObject = { _id, email };
                const token = jwt.sign(
                  tokenObject,
                  process.env.PASSPORT_SECRET
                );

                done(null, {
                  seccess: true,
                  token: "JWT " + token,
                  user: msg,
                });
              })
              .catch((err) => {
                done(null, {
                  seccess: false,
                  user: err,
                });
              });
          }

          // 如果已註冊過且有facebookId，就登入
          else if (user && user.facebookId === profile.id) {
            const tokenObject = { _id: user._id, email: user.email };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

            done(null, {
              seccess: true,
              token: "JWT " + token,
              user,
            });
          }

          // 如果有此email 卻沒有facebookId，但表已被local註冊過
          else {
            done(null, {
              seccess: false,
              message: "此Facebook帳號綁定的email已被註冊過囉！",
            });
          }
        });
      }
    )
  );
};
