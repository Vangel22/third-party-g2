const express = require("express");

const config = require("./pkg/config");
const { sendWelcomeMail } = require("./handlers/mailer");

const api = express();

api.post("api/email", sendWelcomeMail);

api.listen(config.getSection("weather").port, (err) => {
  err
    ? console.log(err)
    : console.log(
        `Server started on port ${config.getSection("weather").port}`
      );
});
