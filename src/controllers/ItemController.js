const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const {
  removeLeadingHashes,
  changeTagCounts,
  compareTags,
} = require("../helpers");
const toTrim = require("../helpers/toTrim");
const validOneString = require("../helpers/validOneString");
const countTagsAndCollections = require("../helpers/tags/countTagsAndCollections");
const getUpdatedAdditionalFields = require("../helpers/tags/getUpdatedAdditionalFields");
const CONN = mongoose.connection;

exports.getAllItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "_id",
      sortDir = -1,
      searchText,
      collectionName = null,
    } = req.query;
    const pageChunk = (+page - 1) * +limit;

    const matchStage = searchText
      ? { $match: { $text: { $search: `"${searchText}"` } } }
      : collectionName
      ? { $match: { collectionName } }
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
        $limit: +limit,
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
  } catch (e) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting the items" });
  }
};

exports.getOneItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const userItem = await UserItem.find({ name: itemName });
    return res.send(userItem);
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting all collections" });
  }
};

exports.getUserItems = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const userItems = await UserItem.find({ collectionName });
    return res.send(userItems);
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting all collections" });
  }
};

exports.create = async (req, res) => {
  const session = await CONN.startSession();
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
      if (!additionalFields.hasOwnProperty(key))
        return res
          .status(400)
          .send({ message: `The field ${key} shouldn't be empty` });

      if (foundCollection.additionalFields[key]["isOneString"]) {
        const isError = validOneString(additionalFields[key]["value"], key);
        if (isError) errors.push(isError);
      }

      if (
        typeof additionalFields[key]["value"] ===
        foundCollection.additionalFields[key]["type"]
      )
        updatedAdditionalFields[key] = additionalFields[key];
      else if (
        foundCollection.additionalFields[key]["type"] === "date" &&
        typeof additionalFields[key]["value"] === "number"
      )
        updatedAdditionalFields[key] = additionalFields[key];
      else errors.push(`Wrong type of field ${key} or the field is empty`);
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
  console.log(req.body);
  const session = await CONN.startSession();
  try {
    session.startTransaction();
    const { idsToDelete } = req.body;
    const { tags, collectionsToUpdate } = await countTagsAndCollections(
      idsToDelete,
      session
    );

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
  console.log("req: ", req.body);
  const session = await CONN.startSession();
  try {
    session.startTransaction();
    let { tags, collectionName } = req.body;
    let trimmedValues = toTrim(req.body);
    const { additionalFields } = trimmedValues;
    const itemToUpdate = await UserItem.findOne({ _id: req.params.id });

    if (!itemToUpdate) {
      return res.status(404).send({ message: "Item is not found" });
    }
    if (collectionName)
      return res
        .status(404)
        .send({ message: "Collection should not be changed" });

    const foundCollection = await UserCollection.findOne({
      name: itemToUpdate.collectionName,
    });

    if (!foundCollection) {
      return res.status(404).send({ message: "Collection is not found" });
    }

    const { updatedAdditionalFields, errors } = getUpdatedAdditionalFields(
      additionalFields,
      itemToUpdate,
      foundCollection
    );
    if (errors.length) return res.status(400).send({ message: errors });

    if (tags) {
      const oldTags = itemToUpdate["tags"];
      const trimmedTags = removeLeadingHashes(tags);
      trimmedValues = { ...trimmedValues, tags: trimmedTags };
      const { tagsToIncrement, tagsToDecrement } = compareTags(
        oldTags,
        trimmedTags
      );
      await changeTagCounts(tagsToIncrement, tagsToDecrement, session);
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
    if (e.code === 11000) {
      return res.status(400).send({
        message:
          "An item with this name already exists. Please choose another name.",
      });
    }
    await session.abortTransaction();
    return res.status(400).send({
      message: "Something went wrong while updating the item",
    });
  } finally {
    session.endSession();
  }
};
