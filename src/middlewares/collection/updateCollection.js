const validateRequestData = require("../middlewareHelper/validateRequestData");

const updateCollection = async (req, res, next) => {
  const fields = Object.keys(req.body);
  const fieldsWithoutAdditionalFields = fields.filter(
    (field) => field !== "additionalFields"
  );

  const errors = await validateRequestData(
    req,
    fieldsWithoutAdditionalFields,
    "type"
  );
  if (errors.length) return res.status(400).send({ errors });
  return next();
};

module.exports = updateCollection;
