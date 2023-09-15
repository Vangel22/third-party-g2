const express = require("express");
const { expressjwt: jwt } = require("express-jwt");

const config = require("./pkg/config");
require("./pkg/db");

const {
  login,
  forgotPassword,
  resetPassword,
  resetPasswordTemplate,
} = require("./handlers/auth");

const { sendWelcomeMail, sendPasswordResetMail } = require("./handlers/mailer");

const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.set("view engine", "ejs");

api.use(
  jwt({
    secret: config.getSection("development").jwt,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/v1/auth/login",
      "/api/v1/auth/reset-password",
      "/api/v1/auth/forgot-password",
      "/forgot-password",
      "/reset-password/:id/:token",
    ],
  })
);

// api.get('/users', ) -> mi treba tuka jwt bidejki users mozeme da gi zememe samo ako sme najaveni
api.post("/api/v1/auth/login", login);
api.post("/api/v1/auth/forgot-password", forgotPassword);
api.post("/reset-password/:id/:token", resetPassword);
api.get("/reset-password/:id/:token", resetPasswordTemplate);

api.post("/api/v1/send-mail", sendWelcomeMail);
api.post("/api/v1/reset-pass", sendPasswordResetMail);

api.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

api.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedAccess") {
    res.status(401).send("Invalid token...");
  }
});

api.listen(config.getSection("development").port, (err) => {
  err
    ? console.error(err)
    : console.log(
        `Server started at port ${config.getSection("development").port}`
      );
});
