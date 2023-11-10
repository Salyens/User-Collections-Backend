const { default: mongoose, Collection } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const { removeLeadingHashes } = require("../helpers");
const compareTags = require("../helpers/compareTags");
const changeTagCounts = require("../helpers/changeTagCounts");
const toTrim = require("../helpers/toTrim");

exports.getAllItems = async (req, res) => {
  try {
    const { searchText } = req.query;
    console.log("searchText: ", searchText);
    const { page = 1, limit = 10, sortBy = "_id", sortDir = -1 } = req.query;
    const pageChunk = (page - 1) * limit;

    const matchStage = searchText
      ? { $match: { $text: { $search: `"${searchText}"` } } }
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
    const { collectionName, tags } = req.body;
    const trimmedTags = removeLeadingHashes(tags);
    const trimmedValues = toTrim(req.body);
    const { additionalFields } = trimmedValues;
    const foundCollection = await UserCollection.findOneAndUpdate(
      { name: collectionName },
      { $inc: { counter: 1 } }
    );
    if (!foundCollection)
      return res.status(400).send({ message: "Collection is not found" });

    const updatedAdditionalFields = {};
    for (const key in foundCollection.additionalFields) {
      if (additionalFields.hasOwnProperty(key))
        updatedAdditionalFields[key] = additionalFields[key];
    }

    const wholeItemInfo = {
      ...trimmedValues,
      additionalFields: updatedAdditionalFields,
      user: { _id, name },
    };

    const newItem = await UserItem.create(wholeItemInfo);
    if (!newItem) {
      return res
        .status(400)
        .send({ message: "Something went wrong while creating the item" });
    }

    await changeTagCounts(trimmedTags);

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

    changeTagCounts([], tags);

    return res.send({ message: "Item successfully deleted" });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the item" });
  }
};

exports.update = async (req, res) => {
  try {
    let { tags } = req.body;
    const trimmedValues = toTrim(req.body);
    const { additionalFields } = trimmedValues;
    tags = removeLeadingHashes(tags);
    const itemId = req.params.id;
    const itemToUpdate = await UserItem.findOne({ _id: itemId });
    const oldTags = itemToUpdate["tags"];

    if (!itemToUpdate) {
      return res.status(404).send({ message: "Item is not found" });
    }

    const updatedAdditionalFields = {};
    for (const key in itemToUpdate.additionalFields) {
      if (additionalFields.hasOwnProperty(key))
        updatedAdditionalFields[key] = additionalFields[key];
      else updatedAdditionalFields[key] = itemToUpdate.additionalFields[key];
    }
    const allItemData = {
      ...trimmedValues,
      additionalFields: updatedAdditionalFields,
      tags,
    };

    Object.assign(itemToUpdate, allItemData);
    itemToUpdate.markModified("additionalFields");
    await itemToUpdate.save();

    tags = removeLeadingHashes(tags);
    const { toAdd, toRemove } = compareTags(oldTags, tags);
    changeTagCounts(toAdd, toRemove);

    return res.send({ message: "Item successfully updated" });
  } catch (_) {

    return res.status(400).send({
      message: "Something went wrong while updating the item",
    });
  }
};
