const validateRequestData = require("../middlewareHelper/validateRequestData");

const loginUser = async (req, res, next) => {
  const fields = ["email", "password"];
  const errors = await validateRequestData(req, fields, "value");
  if (errors.length) return res.status(400).send(errors);
  return next();
};

module.exports = loginUser;
