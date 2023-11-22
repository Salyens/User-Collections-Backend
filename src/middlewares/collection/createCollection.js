const validateRequestData = require("../middlewareHelper/validateRequestData");
const cleanHtml = require("./../../helpers/cleanHTML");

const createCollection = async (req, res, next) => {
  req.body.description = cleanHtml(req.body.description);
  const fields = ["name", "description"];
  const errors = await validateRequestData(req, fields, "type");
  if (errors.length) return res.status(400).send({ errors });
  return next();
};

module.exports = createCollection;
