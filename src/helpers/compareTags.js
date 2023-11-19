const compareTags = (oldTags, newTags) => {
  if (!oldTags.length && !newTags.length)
    return { tagsToIncrement: [], tagsToDecrement: [] };
  
  const tagsToIncrement = newTags.filter((tag) => !oldTags.includes(tag));
  const tagsToDecrement = oldTags.filter((tag) => !newTags.includes(tag));

  return { tagsToIncrement, tagsToDecrement };
};

module.exports = compareTags;
