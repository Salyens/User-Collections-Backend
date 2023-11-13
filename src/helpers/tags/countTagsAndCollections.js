const { UserItem } = require("../../models/UserItem");

const countTagsAndCollections = async (idsToDelete, session) => {
  const tags = [];
  const collectionsToUpdate = {};
  const itemsToDelete = await UserItem.find(
    { _id: { $in: idsToDelete } },
    null,
    { session }
  );

  itemsToDelete.forEach((item) => {
    if (collectionsToUpdate[item["collectionName"]])
      collectionsToUpdate[item["collectionName"]]++;
    else collectionsToUpdate[item["collectionName"]] = 1;
    tags.push(...item.tags);
  });
  return { tags, collectionsToUpdate };
};
module.exports = countTagsAndCollections;
