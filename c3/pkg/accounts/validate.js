const { Validator } = require("node-input-validator");

const AccountSignUp = {
  email: "required|email",
  password: "required|string",
  fullname: "required|string",
};

const AccountLogin = {
  email: "required|email",
  password: "required|string",
};

const validate = async (data, schema) => {
  let v = new Validator(data, schema);
  let e = v.check();
  if (!e) {
    throw {
      code: 400,
      error: v.errors,
    };
  }
};

module.exports = {
  AccountSignUp,
  AccountLogin,
  validate,
};
