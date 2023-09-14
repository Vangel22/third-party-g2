const { sendMail } = require("../pkg/mailer");

const sendWelcomeMail = async (req, res) => {
  try {
    const result = await sendMail(req.body.to, "WELCOME", req.body.message);
    return res.status(201).send(result);
  } catch (err) {
    return res.status(500).send("Error");
  }
};

module.exports = {
  sendWelcomeMail,
};
