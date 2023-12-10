const { Tags } = require("../models/Tags");

exports.getSortedTags = async (req, res) => {
  try {
    let doc = await Tags.findOne();
    if (!doc) {
      doc = new Tags({});
      await doc.save();
    }
    const tags = doc.tags;

    const sortedTags = Object.entries(tags)
      .map(([name, { itemCount, mentionCount }]) => ({
        name,
        weight: itemCount + mentionCount,
      }))
      .sort((a, b) => b.weight - a.weight); 
    return res.send(sortedTags);
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting the tags" });
  }
};
