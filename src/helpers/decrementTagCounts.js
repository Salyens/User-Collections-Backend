const { Tags } = require("../models/Tags");

const decrementTagCounts = async (tagsToRemove) => {
  try {
    const doc = await Tags.findOne();

    tagsToRemove.forEach((tag) => {
      const currentValue = doc.tags.get(tag);
      if (currentValue - 1 < 1) doc.tags.delete(tag);
      else doc.tags.set(tag, currentValue - 1);
    });

    await doc.save();
  } catch (error) {}
};

module.exports = decrementTagCounts;
