const express = require("express");

const config = require("./pkg/config");
const { sendWelcomeMail } = require("./handlers/mailer");

const api = express();
api.use(express.json());

api.post("/api/v1/send-mail", sendWelcomeMail);

api.listen(config.getSection("development").port, (err) => {
  err
    ? console.log(err)
    : console.log(
        `Server started on port ${config.getSection("development").port}`
      );
});
