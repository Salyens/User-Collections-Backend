const updateTags = (req, res, next) => {
  const { tags } = req.body;
  if (!tags) return next();

  if (tags && !Array.isArray(tags)) {
    return res
      .status(400)
      .send({ message: "The 'tags' field should be a list of tags." });
  }

  for (const tag of tags) {
    if (/\s/.test(tag)) {
      return res
        .status(400)
        .send({ message: "Tags should not contain spaces." });
    }
  }
  return next();
};

module.exports = updateTags;
