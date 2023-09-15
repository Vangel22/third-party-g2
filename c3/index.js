const express = require("express");
const { expressjwt: jwt } = require("express-jwt");

const config = require("./pkg/config");
require("./pkg/db");

const { login, resetPassword } = require("./handlers/auth");

const api = express();

api.use(express.json());

api.use(
  jwt({
    secret: config.getSection("development").jwt,
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/v1/auth/login", "/api/v1/auth/resetPassword"],
  })
);

// api.get('/users', ) -> mi treba tuka jwt bidejki users mozeme da gi zememe samo ako sme najaveni
api.post("/api/v1/auth/login", login);
api.post("/api/v1/auth/resetPassword", resetPassword);

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
