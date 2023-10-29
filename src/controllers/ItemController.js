const { default: mongoose } = require("mongoose");

const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const { Tags } = require("../models/Tags");
const removeLeadingHashes = require("../helpers/removeLeadingHashes");

exports.getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdDate", sortDir = -1 } = req.query;
    const pageChunk = (page - 1) * limit;
    const total = await UserItem.countDocuments();

    const userItems = await UserItem.find()
      .skip(pageChunk)
      .limit(limit)
      .sort({ [sortBy]: [sortDir] });
    return res.send({ userItems, total });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting the items" });
  }
};

exports.create = async (req, res) => {
  try {
    const { _id, name } = req.user;
    const { name: itemName, imgURL, tags, collectionId } = req.body;
    const trimmedTags = removeLeadingHashes(tags);
    const userCollection = await UserCollection.findById(collectionId);

    if (!userCollection)
      return res.status(404).send({ message: "Collection is not found" });

    const wholeItemInfo = {
      name: itemName,
      imgURL,
      trimmedTags,
      collectionName: userCollection.name,
      user: { _id, name },
    };

    const newItem = await UserItem.create(wholeItemInfo);
    createNewTags(trimmedTags);
    return res.send(newItem);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send({
        message:
          "A collection with this name already exists. Please choose another name.",
      });
    }
    return res
      .status(400)
      .send({ message: "Something went wrong while creating the collection" });
  }
};

const createNewTags = async (tags) => {
  try {
    const tagsCollection = tags.map((tag) => ({ name: tag }));
    await Tags.insertMany(tagsCollection, { ordered: false });
  } catch (e) {}
};

exports.delete = async (req, res) => {
  try {
    const { idsToDelete } = req.body;
    const { deletedCount } = await UserItem.deleteMany({
      _id: { $in: idsToDelete },
    });
    if (!deletedCount)
      return res.status(404).send({ message: "Item is not found" });
    return res.send({ message: "Item successfully deleted" });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the item" });
  }
};

exports.update = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, imgURL, tags } = req.body;
    const trimmedTags = removeLeadingHashes(tags);

    await UserItem.updateOne(
      {
        _id: { $in: itemId },
      },
      { $set: { name, imgURL, tags:trimmedTags } }
    );

    return res.send({ message: "Item successfully updated" });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while updating the item" });
  }
};
