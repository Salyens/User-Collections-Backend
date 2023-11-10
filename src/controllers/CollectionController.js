const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem, UserItemSchema } = require("../models/UserItem");

exports.getAllCollections = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "counter",
      sortDir = 1,
      search,
    } = req.query;
    const pageChunk = (page - 1) * limit;
    const total = await UserCollection.countDocuments();

    const allCollections = await UserCollection.find()
      .skip(pageChunk)
      .limit(limit)
      .sort({ [sortBy]: [sortDir] });

    return res.send({
      collections: allCollections,
      total,
    });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting all collections" });
  }
};

exports.getOneCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const oneCollection = await UserCollection.find({ _id: id });

    return res.send(oneCollection);
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting all collections" });
  }
};

exports.create = async (req, res) => {
  const { name, description, theme, additionalFields } = req.body;
  console.log("additionalFields: ", additionalFields);
  try {
    const newCollection = await UserCollection.create({
      name: name.trim(),
      description: description.trim(),
      theme,
      additionalFields,
    });

    return res.send(newCollection);
  } catch (_) {
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

exports.delete = async (req, res) => {
  try {
    const { name } = req.body;
    const { deletedCount } = await UserCollection.deleteOne({
      name,
    });

    if (!deletedCount)
      return res.status(404).send({ message: "Collection is not found" });

    await UserItem.deleteMany({ name });

    return res.send({ message: "Collection successfully deleted" });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the collection" });
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const collectionId = req.params.id;

    const foundCollection = await UserCollection.findOneAndUpdate(
      { _id: collectionId },
      { ...req.body },
      { returnDocument: "before" }
    );

    await UserItem.updateMany(
      { collectionName: foundCollection.name },
      { $set: { collectionName: name } }
    );

    return res.send({ message: "Collection successfully updated" });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send({
        message:
          "A collection with this name already exists. Please choose another name.",
      });
    }
    return res
      .status(400)
      .send({ message: "Something went wrong while updating the collection" });
  }
};
