const { Tags } = require("../models/Tags");

const decrementTagCounts = async (tagsToRemove) => {
  try {
    if (!tagsToRemove.length) return;
    const doc = await Tags.findOne();

    tagsToRemove.forEach((tag) => {
      const currentValue = doc.tags[tag].itemCount;
      if (currentValue - 1 < 1) delete doc.tags[tag];
      else doc.tags[tag].itemCount = currentValue - 1;
    });

    doc.markModified("tags");
    await doc.save();
  } catch (error) {}
};

module.exports = decrementTagCounts;
