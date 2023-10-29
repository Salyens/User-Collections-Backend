const { Tags } = require("../models/Tags");

const incrementTagCounts = async (tagsToAdd) => {
  try {
    const doc = (await Tags.findOne()) || new Tags();

    tagsToAdd.forEach((tag) => {
      if (doc.tags.has(tag)) {
        const currentValue = doc.tags.get(tag);
        doc.tags.set(tag, currentValue + 1);
      } else doc.tags.set(tag, 1);
    });
    
    await doc.save();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
module.exports = incrementTagCounts;
