const { Tags } = require("../models/Tags");

const changeTagCounts = async (tagsToAdd, tagsToRemove) => {
  try {
    let doc = await Tags.findOne();

    if (!doc && (tagsToAdd || tagsToRemove)) {
      doc = await Tags.create({});
    }

    if (tagsToAdd && tagsToAdd.length > 0) {
      tagsToAdd.forEach((tag) => {
        if (!doc.tags) doc.tags = {};
        doc.tags[tag] = doc.tags[tag] || { itemCount: 0, mentionCount: 0 };
        doc.tags[tag].itemCount++;
      });
    }

    if (tagsToRemove && tagsToRemove.length > 0) {
      tagsToRemove.forEach((tag) => {
        if (doc.tags[tag]) {
          if (doc.tags[tag].itemCount - 1 < 1) delete doc.tags[tag];
          else doc.tags[tag].itemCount--;
        }
      });
    }

    doc.markModified("tags");
    await doc.save();
  } catch (error) {
    console.error('Error in incrementTagCounts:', error);
    throw error; 
  }
};

module.exports = changeTagCounts;
