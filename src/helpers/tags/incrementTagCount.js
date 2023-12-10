const incrementTagCount = (tagsToIncrement, doc, param) => {
  doc.tags = doc.tags ?? {};
  tagsToIncrement &&
    tagsToIncrement.forEach((tag) => {
      doc.tags[tag] = doc.tags[tag] ?? { itemCount: 0, mentionCount: 0 };
      doc.tags[tag][param]++;
    });
  return doc;
};

module.exports = incrementTagCount;

