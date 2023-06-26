const user = require("../db/modle/user");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

exports.localStrategy = new localStrategy(async (username, password, done) => {
  try {
    //9>>13
    const founduser = await user.findOne({ username: username });
    if (!founduser) return done(null, false);

    const paaswordMatch = await bcrypt.compare(password, founduser.password);
    if (!paaswordMatch) return done(null, false);

    done(null, founduser);
  } catch (error) {
    return done(error);
  }
});
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (tokenPayload, done) => {
    if (Date.now > tokenPayload.exp * 1000) {
      return done(null, false);
    }

    try {
      const user = await User.findById(tokenPayload._id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
