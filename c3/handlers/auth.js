const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  validate,
  AccountSignUp,
  AccountLogin,
} = require("../pkg/accounts/validate");
const accounts = require("../pkg/accounts");
const config = require("../pkg/config");
const { sendMail } = require("../pkg/mailer");

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
    return res.status(500).send("Internal Server Error");
  }
};

const register = async (req, res) => {
  try {
    await validate(req.body, AccountSignUp);
    const exists = await accounts.getByEmail(req.body.email);
    if (exists) {
      return res.status(400).send("Account with this email already exists!");
    }
    req.body.password = bcrypt.hashSync(req.body.password);
    const acc = await accounts.create(req.body);
    return res.status(201).send(acc);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await accounts.getByEmail(email);

  if (!user) {
    res.status(400).send("User not registered");
  }

  const secret = config.getSection("development").jwt + user.password;
  const payload = {
    email: user.email,
    id: user.id, //_id
  };

  //header, payload, signature

  const token = jwt.sign(payload, secret, { expiresIn: "15m" });

  const link = `http://localhost:10000/reset-password/${user.id}/${token}`;
  //req.params.id req.params.token
  console.log("link", link);

  try {
    await sendMail(user.email, "PASSWORD_RESET", { user, link });
    res.status(200).send("Password reset link has been sent to your email...");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const resetPasswordTemplate = async (req, res) => {
  const { id, token } = req.params;

  const user = await accounts.getById(id);

  if (!user) {
    res.status(400).send("User not found!");
  }

  const secret = config.getSection("development").jwt + user.password;
  try {
    const payload = jwt.verify(token, secret);
    return res.render("reset-password", { email: user.email });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPass } = req.body;

  if (password !== confirmPass) {
    return res.status(400).send("Passwords do not match!");
  }

  const user = accounts.getById(id);

  if (!user) {
    res.status(400).send("User not found!");
  }

  //header od jwt tokenot
  const secret = config.getSection("development").jwt + user.password;

  try {
    const payload = jwt.verify(token, secret);
    await accounts.setNewPassword(id, password);
    user.password = password;
    res.send(user);
    res.render("reset-password", { email: user.email });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  resetPasswordTemplate,
};
