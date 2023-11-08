const { default: mongoose, Collection } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const {
  removeLeadingHashes,
  incrementTagCounts,
  decrementTagCounts,
} = require("../helpers");
const compareTags = require("../helpers/compareTags");


exports.getAllItems = async (req, res) => {
  try {
    const { searchText } = req.query;
    const { page = 1, limit = 2, sortBy = "_id", sortDir = -1 } = req.query;
    const pageChunk = (page - 1) * limit;

    const matchStage = searchText
      ? { $match: { $text: { $search: searchText } } }
      : { $match: {} };

    const aggregationPipeline = [
      matchStage,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $sort: { [`data.${sortBy}`]: sortDir },
      },
      {
        $skip: pageChunk,
      },
      {
        $limit: limit,
      },
      {
        $group: {
          _id: "$_id",
          total: { $first: "$total" },
          userItems: { $push: "$data" },
        },
      },
    ];

    const results = await UserItem.aggregate(aggregationPipeline);

    return res.send(
      results[0]
        ? { userItems: results[0].userItems, total: results[0].total }
        : { userItems: [], total: 0 }
    );
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting the items" });
  }
};

exports.create = async (req, res) => {
  try {
    const { _id, name } = req.user;
    const {
      name: itemName,
      imgURL,
      tags,
      collectionName,
      additionalFields,
    } = req.body;
    const trimmedTags = removeLeadingHashes(tags);

    const foundCollection = await UserCollection.findOneAndUpdate(
      { name: collectionName },
      { $inc: { counter: 1 } }
    );
    if (!foundCollection)
      return res.status(400).send({ message: "Collection is not found" });

    const wholeItemInfo = {
      name: itemName.trim(),
      imgURL,
      tags: trimmedTags,
      collectionName,
      user: { _id, name },
      additionalFields,
    };

    console.log(wholeItemInfo);

    const addedTags = await incrementTagCounts(trimmedTags);
    if (!addedTags)
      return res
        .status(400)
        .send({ message: "Something went wrong while adding the tags" });

    const newItem = await UserItem.create(wholeItemInfo);

    return res.send(newItem);
  } catch (_) {
    if (e.code === 11000) {
      return res.status(400).send({
        message:
          "An item with this name already exists. Please choose another name.",
      });
    }
    return res
      .status(400)
      .send({ message: "Something went wrong while creating the item" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idsToDelete } = req.body;
    const tags = [];
    const collectionsToUpdate = {};
    const itemsToDelete = await UserItem.find({ _id: { $in: idsToDelete } });

    itemsToDelete.forEach((item) => {
      if (collectionsToUpdate[item["collectionName"]])
        collectionsToUpdate[item["collectionName"]]++;
      else collectionsToUpdate[item["collectionName"]] = 1;
      tags.push(...item.tags);
    });

    const updateOperations = Object.keys(collectionsToUpdate).map(
      (collectionName) => ({
        updateOne: {
          filter: { name: collectionName },
          update: { $inc: { counter: -collectionsToUpdate[collectionName] } },
        },
      })
    );

    await UserCollection.bulkWrite(updateOperations);
    const { deletedCount } = await UserItem.deleteMany({
      _id: { $in: idsToDelete },
    });
    if (!deletedCount)
      return res.status(404).send({ message: "Item is not found" });

    decrementTagCounts(tags);

    return res.send({ message: "Item successfully deleted" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the item" });
  }
};

exports.update = async (req, res) => {
  try {
    let { name, collectionName, tags } = req.body;
    console.log("newCollectionName: ", collectionName);

    const itemId = req.params.id;
    const itemToUpdate = await UserItem.findOne({ _id: itemId });

    if (!itemToUpdate) {
      return res.status(404).send({ message: "Item is not found" });
    }

    if (collectionName && collectionName !== itemToUpdate["collectionName"]) {
      await UserCollection.findOneAndUpdate(
        { name: collectionName },
        { $inc: { counter: 1 } }
      );
      await UserCollection.findOneAndUpdate(
        { name: itemToUpdate["collectionName"] },
        { $inc: { counter: -1 } }
      );
    }
    Object.assign(itemToUpdate, req.body);
    await itemToUpdate.save();

    tags = removeLeadingHashes(tags);
    const { toAdd, toRemove } = compareTags(itemToUpdate.tags, tags);
    incrementTagCounts(toAdd);
    decrementTagCounts(toRemove);

    return res.send({ message: "Item successfully updated" });
  } catch (error) {
    console.log("error: ", error);

    return res.status(400).send({
      message: "Something went wrong while updating the item",
    });
  }
};
