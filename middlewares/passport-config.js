const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require(".././models/users");

function initialize(passport) {
  const authenticate_user = async (username, password, done) => {
    const user = await User.findOne({ username: username });
    if (user === null) {
      return done(null, false, { message: "No user with that username" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticate_user)
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  });
}
module.exports = initialize;
