const validator = require("validator");
const { validEmail, validPassword } = require("../utils/validations");

const registrationValid = (req, res, next) => {
  const errors = [];
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(422).send({ message: "All fields are required" });

  if (!validEmail(email)) errors.push("Invalid email");
  if (!validPassword(password)) errors.push("Invalid password");

  if (errors.length) return res.status(422).send({ message: errors });
  return next();
};

module.exports = registrationValid;
