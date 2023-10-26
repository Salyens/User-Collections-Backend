const itemValidation = (req, res, next) => {
  const { name, collectionId, tags } = req.body;
  const errors = [];

  const isValid = (fieldName, value) => {
    if (!value || !value.length) errors.push(`The '${fieldName}' is required`);
  };
  isValid("name", name);
  isValid("collection", collectionId);
  isValid("tags", tags);

  if (errors.length) return res.status(400).send({ message: errors });
  next();
};

module.exports = itemValidation;
