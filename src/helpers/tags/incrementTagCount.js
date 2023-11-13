const incrementTagCount = (tagsToIncrement, doc) => {
  doc.tags = doc.tags ?? {};
  tagsToIncrement &&
    tagsToIncrement.forEach((tag) => {
      doc.tags[tag] = doc.tags[tag] ?? { itemCount: 0, mentionCount: 0 };
      doc.tags[tag].itemCount++;
    });
  return doc;
};

module.exports = incrementTagCount;



  //   if (tagsToIncrement && tagsToIncrement.length) {
  //     if (!doc.tags) doc.tags = {};
  //     tagsToIncrement.forEach((tag) => {
  //       doc.tags[tag] = doc.tags[tag] ?? { itemCount: 0, mentionCount: 0 };
  //       doc.tags[tag].itemCount++;
  //     });
  //   }