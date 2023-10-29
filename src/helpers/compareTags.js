const compareTags = (oldTags, newTags) => {
  if (
    oldTags.length === newTags.length &&
    oldTags.every((value, index) => value === newTags[index])
  ) {
    return { toAdd: [], toRemove: [] };
  }

  const toAdd = newTags.filter((item) => !oldTags.includes(item));
  const toRemove = oldTags.filter((item) => !newTags.includes(item));

  return { toAdd, toRemove };
};

module.exports = compareTags;
