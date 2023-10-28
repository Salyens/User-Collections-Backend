const isEmpty = require("../../helper/isEmpty");

const createCollection = (req, res, next) => {
  const { name, description } = req.body;
  const fields = { name, description };

  const errors = isEmpty(fields, "collection");

  if (errors.length) {
    return res.status(400).send({ errors });
  }
  return next();
};
module.exports = createCollection;
