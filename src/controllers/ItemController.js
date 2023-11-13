const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const { removeLeadingHashes, changeTagCounts } = require("../helpers");
const compareTags = require("../helpers/compareTags");
const toTrim = require("../helpers/toTrim");
const { Tags } = require("../models/Tags");
const validOneString = require("../helpers/validOneString");
const countTagsAndCollections = require("../helpers/tags/countTagsAndCollections");

exports.getAllItems = async (req, res) => {
  try {
    const { searchText } = req.query;
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
  const conn = mongoose.connection;
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const { _id, name } = req.user;
    const { collectionName, tags } = req.body;
    const trimmedTags = removeLeadingHashes(tags);
    const trimmedValues = toTrim(req.body);
    const { additionalFields } = trimmedValues;
    const foundCollection = await UserCollection.findOneAndUpdate(
      { name: collectionName },
      { $inc: { counter: 1 } },
      { session }
    );
    if (!foundCollection)
      return res.status(404).send({ message: "Collection is not found" });
    const errors = [];
    const updatedAdditionalFields = {};
    for (const key in foundCollection.additionalFields) {
      if (additionalFields.hasOwnProperty(key)) {
        if (foundCollection.additionalFields[key]["isOneString"])
          validOneString(additionalFields[key]["value"], errors);
        if (
          typeof additionalFields[key]["value"] ===
          foundCollection.additionalFields[key]["type"]
        )
          updatedAdditionalFields[key] = additionalFields[key];
      } else errors.push(`Wrong type of field ${key}`);
    }
    if (errors.length) return res.status(400).send({ message: errors });

    const wholeItemInfo = {
      ...trimmedValues,
      additionalFields: updatedAdditionalFields,
      tags: trimmedTags,
      user: { _id, name },
    };

    const newItem = await UserItem.create([wholeItemInfo], { session });
    await changeTagCounts(trimmedTags, [], session);

    await session.commitTransaction();

    return res.send(newItem);
  } catch (e) {
    await session.abortTransaction();
    if (e.message === "tagsError")
      return res
        .status(400)
        .send({ message: "Something went wrong while adding the tags" });
    if (e.code === 11000) {
      return res.status(400).send({
        message:
          "An item with this name already exists. Please choose another name.",
      });
    }
    return res
      .status(400)
      .send({ message: "Something went wrong while creating the item" });
  } finally {
    session.endSession();
  }
};

exports.delete = async (req, res) => {
  const conn = mongoose.connection;
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const { idsToDelete } = req.body;
    const {tags, collectionsToUpdate} = await countTagsAndCollections(idsToDelete, session);

    const updateOperations = Object.keys(collectionsToUpdate).map(
      (collectionName) => ({
        updateOne: {
          filter: { name: collectionName },
          update: { $inc: { counter: -collectionsToUpdate[collectionName] } },
        },
      })
    );
    await changeTagCounts([], tags, session);

    await UserCollection.bulkWrite(updateOperations, { session });
    const { deletedCount } = await UserItem.deleteMany(
      {
        _id: { $in: idsToDelete },
      },
      { session }
    );
    if (!deletedCount)
      return res.status(404).send({ message: "Item is not found" });


    await session.commitTransaction();
    return res.send({ message: "Item successfully deleted" });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    if (e.message === "tagsError")
      return res
        .status(400)
        .send({ message: "Something went wrong while adding the tags" });
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the item" });
  } finally {
    session.endSession();
  }
};

exports.update = async (req, res) => {
  const conn = mongoose.connection;
  const session = await conn.startSession();
  try {
    session.startTransaction();
    let { tags, collectionName } = req.body;
    let trimmedValues = toTrim(req.body);
    const { additionalFields } = trimmedValues;
    const itemId = req.params.id;
    const itemToUpdate = await UserItem.findOne({ _id: itemId }, null, {
      session,
    });

    const errors = [];
    if (!itemToUpdate) {
      return res.status(404).send({ message: "Item is not found" });
    }
    if (collectionName)
      return res.status(404).send({ message: "Collection should not be changed" });

    const foundCollection = await UserCollection.findOne(
      {
        name: itemToUpdate.collectionName,
      },
      null,
      { session }
    );

    if (!foundCollection) {
      return res.status(404).send({ message: "Collection is not found" });
    }

    const updatedAdditionalFields = {};
    for (const key in additionalFields) {
      if (itemToUpdate.additionalFields.hasOwnProperty(key)) {
        if (foundCollection.additionalFields[key]["isOneString"])
          validOneString(additionalFields[key]["value"], errors);
        if (
          typeof additionalFields[key]["value"] ===
          foundCollection.additionalFields[key]["type"]
        )
          updatedAdditionalFields[key] = additionalFields[key];
        else errors.push(`Wrong type of field ${key}`);
      }
    }

    if (errors.length) return res.status(400).send({ message: errors });

    if (tags) {
      const oldTags = itemToUpdate["tags"];
      const trimmedTags = removeLeadingHashes(tags);
      trimmedValues = { ...trimmedValues, tags:trimmedTags };
      const { toAdd, toRemove } = compareTags(oldTags, trimmedTags);
      await changeTagCounts(toAdd, toRemove, session);
    }

    const allItemData = {
      ...trimmedValues,
      additionalFields: {
        ...itemToUpdate.additionalFields,
        ...updatedAdditionalFields,
      },
    };

    Object.assign(itemToUpdate, allItemData);
    itemToUpdate.markModified("additionalFields");
    await itemToUpdate.save({ session });
    await session.commitTransaction();
    return res.send({ message: "Item successfully updated" });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    return res.status(400).send({
      message: "Something went wrong while updating the item",
    });
  } finally {
    session.endSession();
  }
};
