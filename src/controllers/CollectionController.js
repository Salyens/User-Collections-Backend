const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const { toTrim } = require("../helpers");
const CONN = mongoose.connection;

exports.getAllCollections = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "counter",
      sortDir = -1,
    } = req.query;
    const pageChunk = (page - 1) * limit;
    const userId = req.user ? req.user._id : null;
    const query = userId ? { "user._id": userId } : {};
    const allCollections = await UserCollection.find(query)
      .skip(pageChunk)
      .limit(limit)
      .sort({ [sortBy]: [sortDir] });
    const total = await UserCollection.countDocuments(query);

    return res.send({
      collections: allCollections,
      total,
    });
  } catch (e) {
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
  try {
    const { _id, name: userName } = req.user;
    const trimmedValues = toTrim(req.body);
    const newCollection = await UserCollection.create({
      ...trimmedValues,
      user: { _id, name: userName },
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
  const session = await CONN.startSession();
  try {
    session.startTransaction();
    const { name } = req.body;
    let { deletedCount } = await UserCollection.deleteOne(
      {
        name,
      },
      { session }
    );

    if (!deletedCount)
      return res.status(404).send({ message: "Collection is not found" });

    await UserItem.deleteMany({ collectionName: name }, { session });

    await session.commitTransaction();
    return res.send({ message: "Collection successfully deleted" });
  } catch (_) {
    await session.abortTransaction();
    return res
      .status(400)
      .send({ message: "Something went wrong while deleting the collection" });
  } finally {
    session.endSession();
  }
};

exports.update = async (req, res) => {
  const session = await CONN.startSession();
  try {
    session.startTransaction();
    const trimmedValues = toTrim(req.body);
    const { name } = trimmedValues;
    const foundCollection = await UserCollection.findOneAndUpdate(
      { _id: req.params.id },
      trimmedValues,
      { returnDocument: "before", session }
    );

    await UserItem.updateMany(
      { collectionName: foundCollection.name },
      { $set: { collectionName: name } },
      { session }
    );
    await session.commitTransaction();
    return res.send({ message: "Collection successfully updated" });
  } catch (e) {
    await session.abortTransaction();
    if (e.code === 11000) {
      return res.status(400).send({
        message:
          "A collection with this name already exists. Please choose another name.",
      });
    }
    return res
      .status(400)
      .send({ message: "Something went wrong while updating the collection" });
  } finally {
    session.endSession();
  }
};
