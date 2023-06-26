const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");
const generateToken = (user) => {
  const payload = {
    username: user.username,
    _id: user._id,
  };

  const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXP,
  });
  return token;
};

exports.signin = async (req, res) => {
  try {
    const Token = creatToken(req, res);
    const { user } = req;
    const payload = {
      id: user.id,
      name: user.name,
    };
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    // res.status(500).json("Server Error");
    return next(error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
