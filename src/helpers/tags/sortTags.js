const sortTags = (tagsObject) => {
  const tagsList = Object.entries(tagsObject).map(([name, counts]) => {
    return { name, ...counts };
  });

  tagsList.sort((a, b) => {
    const sumA = a.itemCount + a.mentionCount;
    const sumB = b.itemCount + b.mentionCount;

    return sumB - sumA;
  });

  return tagsList;
};

module.exports = sortTags;
