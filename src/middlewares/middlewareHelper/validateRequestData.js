const { check, validationResult } = require("express-validator");

const validateRequestData = async (req, fields, value) => {
  const additionalFieldsKeys = Object.keys(req.body.additionalFields || {}).map(
    (key) => `additionalFields.${key}.${value}`
  );
  const allFields = [...fields, ...additionalFieldsKeys];
  const validValues = createFieldValidations(req.body, allFields, value);

  await Promise.all(validValues.map((validation) => validation.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errors.array().map((error) => error.msg);
  }
  return [];
};

const getValueByPath = (obj, path) => {
  return path.split(".").reduce((currentValue, key) => {
    return currentValue ? currentValue[key] : null;
  }, obj);
};

const createFieldValidations = (reqBody, fields, value) => {
  const fieldChecks = fields.map((field) => {
    const fieldParts = field.split(".");
    let additionalField = fieldParts.length === 3 ? fieldParts[1] : field;
    const fieldValue = getValueByPath(reqBody, field);

    const checkField = check(field)
      .notEmpty()
      .withMessage(`The field '${additionalField}' shouldn't be empty`)
      .custom(() => {
        if (
          fieldParts[0] === "additionalFields" &&
          value === "type" &&
          fieldValue !== "string" &&
          fieldValue !== "number" &&
          fieldValue !== "boolean" &&
          fieldValue !== "date"
        ) {
          return Promise.reject(
            `The type of field '${additionalField}' is invalid`
          );
        }
        return true;
      });

    return typeof fieldValue === "string"
      ? checkField.trim().escape()
      : checkField;
  });

  return [...fieldChecks];
};

module.exports = validateRequestData;
