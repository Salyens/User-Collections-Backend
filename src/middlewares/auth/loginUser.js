const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");

const fields = [
  { name: "email"},
  { name: "password"},
];

const loginUser = generateValidationMiddleware(fields, "user");

module.exports = loginUser;
