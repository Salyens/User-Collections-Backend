const isExist = require("../../helper/isExist");

const updateCollection = (req, res, next) => {
  const errors = isExist(req.body, "collection");

  if (errors.length) {
    return res.status(400).send({ errors });
  }
  return next();
};
module.exports = updateCollection;
