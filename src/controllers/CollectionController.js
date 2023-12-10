const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const { toTrim } = require("../helpers");
const decodeHTML = require("../helpers/decodeHTML");
const { uploadFile, getSignedImageUrl } = require("../s3");
const CONN = mongoose.connection;
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

exports.getAllCollections = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortDir = -1 } = req.query;
    const pageChunk = (page - 1) * limit;
    const isMeEndpoint = req.path.includes("/me");
    const userId = isMeEndpoint && req.user ? req.user._id : null;
    const query = userId ? { "user._id": userId } : {};

    const allCollections = await UserCollection.find(query)
      .skip(pageChunk)
      .limit(limit)
      .sort({ counter: sortDir, _id: 1 });
    const total = await UserCollection.countDocuments(query);

    const decodedCollections = decodeHTML(allCollections);

    const updatedCollections = await Promise.all(
      decodedCollections.map(async (collection) => {
        const plainObject = collection.toObject();
        if (plainObject.imgURL) {
          plainObject.imgURL = await getSignedImageUrl(plainObject.imgURL);
        }
        return plainObject;
      })
    );

    return res.send({
      collections: updatedCollections,
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
    const { collectionName } = req.params;
    const oneCollection = await UserCollection.find({ name: collectionName });
    const decodedCollection = decodeHTML(oneCollection);

    if (decodedCollection.length && decodedCollection[0].imgURL) {
      decodedCollection[0].imgURL = await getSignedImageUrl(
        decodedCollection[0].imgURL
      );
    }

    return res.send(decodedCollection);
  } catch (e) {
    console.log("e: ", e);
    return res
      .status(400)
      .send({ message: "Something went wrong while getting one collections" });
  }
};

exports.create = async (req, res) => {
  try {
    const { _id, name: userName } = req.user;
    const trimmedValues = toTrim(req.body);
    const response = await uploadFile(req.file);
    if (response) await unlinkFile(req.file.path);

    const newCollection = await UserCollection.create({
      ...trimmedValues,
      ...(response && { imgURL: response.Key }),
      user: { _id, name: userName },
    });

    const decodedCollection = decodeHTML(newCollection);
    return res.send(decodedCollection);
  } catch (e) {
    console.log("e: ", e);
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
    const { collectionName } = req.params;
    const { deletedCount } = await UserCollection.deleteOne(
      { name: collectionName },
      { session }
    );

    if (!deletedCount)
      return res.status(404).send({ message: "Collection is not found" });

    await UserItem.deleteMany({ collectionName }, { session });
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
    const response = await uploadFile(req.file);
    if (response) await unlinkFile(req.file.path);
    const { name } = trimmedValues;
    const oldCollection = await UserCollection.findOne({ _id: req.params.id });
    const updatedCollection = await UserCollection.findOneAndUpdate(
      { _id: req.params.id },
      { ...trimmedValues, ...(response && { imgURL: response.Key }) },
      { returnDocument: "after", session }
    );
    if (updatedCollection.imgURL) {
      updatedCollection.imgURL = await getSignedImageUrl(
        updatedCollection.imgURL
      );
    }
    const decodedCollection = decodeHTML(updatedCollection);

    await UserItem.updateMany(
      { collectionName: oldCollection.name },
      { $set: { collectionName: name } },
      { session }
    );

    await session.commitTransaction();
    return res.send(decodedCollection);
  } catch (e) {
    console.log("e: ", e);
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
