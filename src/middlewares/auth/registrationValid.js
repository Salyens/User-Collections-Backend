const { check, validationResult } = require("express-validator");

const registrationValidations = [
  check("email").isEmail().withMessage("Enter a valid email"),
  check("name").notEmpty().withMessage("Name cannot be empty"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/\W/)
    .withMessage("Password must contain at least one special character"),
];

const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(422).json({ message: errorMessages });
  }
  return next();
};

module.exports = [...registrationValidations, handleValidationResult];
