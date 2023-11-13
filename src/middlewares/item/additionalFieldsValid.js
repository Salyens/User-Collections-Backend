const { body, validationResult } = require("express-validator");

const validateAdditionalFields = [
  body("additionalFields.*.type").exists().withMessage("Type is required"),
  body("additionalFields.*.value").exists().withMessage("Value is required"),

  body("additionalFields.*").custom((field, { location, path }) => {
    const key = path.split(".")[1];

    if (field.type === "string" && field.isOneString) {
      if (typeof field.value !== "string") {
        throw new Error(`Field '${key}' must be a string`);
      }
      if (field.value.length > 8) {
        throw new Error(`Field '${key}' shouldn't be more than 5 characters`);
      }
    }

    if (field.type === "date") {
      const date = new Date(field.value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date in field '${key}'`);
      }
    }

    if (
      field.type !== "string" &&
      field.type !== "date" &&
      typeof field.value !== field.type
    ) {
      throw new Error(`Wrong type of field '${key}', expected ${field.type}`);
    }

    return true;
  }),
];

const additionalFieldsValid = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json(errors.array().map((err) => err.msg));

  next();
};

module.exports = { validateAdditionalFields, additionalFieldsValid };
