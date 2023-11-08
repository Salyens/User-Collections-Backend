const getBiggestCollections = (items) => {
  const collections = {};

  for (const el of items) {
    if (collections[el.collectionName]) collections[el.collectionName]++;
    else collections[el.collectionName] = 1;
  }
  const sortedObj = Object.fromEntries(
    Object.entries(collections)
      .toSorted(([, a], [, b]) => b - a)
      .slice(0, 5)
  );
  return Object.keys(sortedObj);
};
module.exports = getBiggestCollections;
