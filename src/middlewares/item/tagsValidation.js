const tagsValidation = (req, res, next) => {
  const { tags } = req.body;

  if (!Array.isArray(tags)) {
    return res
      .status(400)
      .send({ message: "The 'tags' field should be an array." });
  }

  for (let tag of tags) {
    if (/\s/.test(tag)) {
      return res
        .status(400)
        .send({ message: "Tags should not contain spaces." });
    }
  }
  next();
};

module.exports = tagsValidation;
