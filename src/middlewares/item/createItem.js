const validateRequestData = require("../middlewareHelper/validateRequestData");

const createItem = async (req, res, next) => {
  const fields = ["name", "collectionName", "tags"];
  const errors = await validateRequestData(req, fields, "value");
  if (errors.length) return res.status(400).send({ errors });
  return next();
};

module.exports = createItem;
