const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");

exports.getAllCollections = async (req, res) => {
  try {
    const { page = 1, limit = 2, sortBy = "_id", sortDir = -1 } = req.query;
    const pageChunk = (page - 1) * limit;
    const total = await UserCollection.countDocuments();

    const collections = await UserCollection.find()
      .skip(pageChunk)
      .limit(limit)
      .sort({ [sortBy]: [sortDir] });
      
    return res.send({collections, total});
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while getting all collections" });
  }
};

exports.create = async (req, res) => {
  try {
    const newCollection = await UserCollection.create({
      ...req.body,
      userId: req.user._id,
    });
    return res.send(newCollection);
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

exports.delete = async (req, res) => {
  try {
    const { idsToDelete } = req.body;
    const { deletedCount } = await UserCollection.deleteMany({
      _id: { $in: idsToDelete },
    });
    if (!deletedCount)
      return res.status(404).send({ message: "Users is not found" });
    return res.send({ message: "Users successfully deleted" });
  } catch (_) {
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the collection" });
  }
};

exports.update = async (req, res) => {
  const collectionId = req.params.id;
  try {
    const { name, description } = req.body;
    await UserCollection.updateOne(
      {
        _id: { $in: collectionId },
      },
      { $set: { name, description } }
    );

    return res.send({ message: "Users successfully updated" });
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
