const isEmpty = require("../../helper/isEmpty");

const itemValidation = (req, res, next) => {
  const { name, collectionId, tags } = req.body;
  const fields = {
    name,
    collection: collectionId,
    tags,
  };

  const errors = isEmpty(fields, "item");

  if (errors.length) return res.status(400).send({ message: errors });
  return next();
};

module.exports = itemValidation;
