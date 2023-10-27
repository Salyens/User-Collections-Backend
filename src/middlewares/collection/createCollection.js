const createCollection = (req, res, next) => {
  const {
    body: { name, description },
  } = req;
  const errors = [];

  const checkValue = (valueName, value) => {
    if (!value || !value.trim()) errors.push(`Invalid ${valueName}`);
  };

  checkValue("collection name", name);
  checkValue("collection description", description);

  if (errors.length) {
    return res.status(400).send({ errors });
  }
  return next();
};
module.exports = createCollection;
