const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  validate,
  AccountSignUp,
  AccountLogin,
} = require("../pkg/accounts/validate");
const accounts = require("../pkg/accounts");
const config = require("../pkg/config");

const login = async (req, res) => {
  try {
    await validate(req.body, AccountLogin);
    const { email, password } = req.body;

    const account = await accounts.getByEmail(email);

    if (!account) {
      return res.status(400).send("Account not found!");
    }

    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).send("Incorrect password!");
    }
    const payload = {
      fullname: account.fullname,
      email: account.email,
      id: account._id,
      exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60, //7 days in the future
    };

    const token = jwt.sign(payload, config.getSection("development").jwt);
    return res.status(200).send(token);
  } catch (err) {
    console.error(err);
    return res.status(err.status).send(err.error);
  }
};

const register = async (req, res) => {
  try {
    await validate(req.body, AccountSignUp);
    const exists = await account.getByEmail(req.body.email);
    if (exists) {
      return res.status(400).send("Account with this email already exists!");
    }
    req.body.password = bcrypt.hashSync(req.body.password);
    const acc = await account.create(req.body);
    return res.status(201).send(acc);
  } catch (err) {
    console.log(err);
    return res.status(err.status).send(err.error);
  }
};

const refreshToken = async (req, res) => {};

const forgotPassword = async (req, res) => {};

const resetPassword = async (req, res) => {};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  refreshToken,
};
