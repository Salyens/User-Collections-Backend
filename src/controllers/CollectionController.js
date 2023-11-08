const { default: mongoose } = require("mongoose");
const {
  UserCollection,
  UserCollectionSchema,
} = require("../models/UserCollection");
const { UserItem, UserItemSchema } = require("../models/UserItem");
const replaceKey = require("../helpers/replaceKey");
const toTrim = require("../helpers/toTrim");

exports.getCollections = async (req, res) => {
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

exports.create = async (req, res) => {
  const { name, description, theme } = req.body;
  try {
    const trimmedCollectionInfo = toTrim({ name, description });
    const newCollection = await UserCollection.create({
      ...trimmedCollectionInfo,
      theme,
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
    const { name, description, theme } = req.body;
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
    console.log(e);
    return res
      .status(400)
      .send({ message: "Something went wrong while updating the collection" });
  }
};

exports.addNewFields = (req, res) => {
  try {
    for (const key in req.body) {
      UserItemSchema.add({ [key]: req.body[key] });
    }
    mongoose.model("UserItem", UserItemSchema);

    return res.send({ message: "New fields successfully added" });
  } catch (error) {
    console.log("error: ", error);
  }
};
