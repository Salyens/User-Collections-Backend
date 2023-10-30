const { Tags } = require("../models/Tags");

const incrementTagCounts = async (tagsToAdd) => {
  try {
    let doc = (await Tags.findOne()) || null;

    if (!doc) doc = await Tags.create({});

    tagsToAdd.forEach((tag) => {
      if (doc.tags && doc.tags[tag]) {
        doc.tags[tag].itemCount = doc.tags[tag].itemCount + 1;
      } else {
        if (!doc.tags) {
          doc.tags = {};
        }
        doc.tags[tag] = { itemCount: 1, mentionCount:0 };
      }
    });

    doc.markModified('tags');
    await doc.save();
    return true;
  } catch (error) {
    console.log(error);
  }
};
module.exports = incrementTagCounts;
