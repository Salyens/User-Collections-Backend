const { Tags } = require("../../models/Tags");
const decrementTagCount = require("./decrementTagCount");
const incrementTagCount = require("./incrementTagCount");

const changeTagCounts = async (tagsToIncrement, tagsToDecrement, session) => {
  try {
    let doc = await Tags.findOne().session(session);
    if (!doc) {
      doc = new Tags({});
      await doc.save({ session });
    }

    incrementTagCount(tagsToIncrement, doc, "itemCount");
    decrementTagCount(tagsToDecrement, doc);

    doc.markModified("tags");
    await doc.save({ session });
  } catch (e) {
    throw new Error("tagsError");
  }
};

module.exports = changeTagCounts;
