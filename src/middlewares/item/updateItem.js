const isExist = require("../../helper/isExist");

const updateItem = (req, res, next) => {
  const errors = isExist(req.body, "item");

  if (errors.length) {
    return res.status(400).send({ errors });
  }
  return next();
};
module.exports = updateItem;
