const { Tags } = require("../../models/Tags");
const incrementTagCount = require("./incrementTagCount");

const incrementTagCountBySearch = async (tagsToIncrement) => {
  try {
    let doc = await Tags.findOne();
    if (!doc) {
      doc = new Tags({});
      await doc.save();
    }
    if (Object.keys(doc.tags).includes(tagsToIncrement)) {
      incrementTagCount([tagsToIncrement], doc, "mentionCount");
    } else return;

    doc.markModified("tags");
    await doc.save();
  } catch (e) {
    throw new Error("tagsError");
  }
};

module.exports = incrementTagCountBySearch;
