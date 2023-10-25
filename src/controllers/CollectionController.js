const { default: mongoose } = require("mongoose");
const { UserCollection } = require("../models/UserCollection");

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await UserCollection.find();
    return res.send({ collections });
  } catch (_) {
    return res.status(400).send({ message: "Something went wrong" });
  }
};

exports.create = async (req, res) => {
  try {
    const newCollection = await UserCollection.create({
      ...req.body,
      userId: req.user._id,
    });
    return res.send(newCollection);
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

exports.delete = async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const { idsToDelete } = req.body;
    const convertedIds = idsToDelete.map((id) => new ObjectId(id));

    const { deletedCount } = await UserCollection.deleteMany({
      _id: { $in: convertedIds },
    });
    if (!deletedCount)
      return res.status(404).send({ message: "Users is not found" });
    return res.send({ message: "Users successfully deleted" });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

exports.update = async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const { id, name, description } = req.body;
    const convertedId = new ObjectId(id);
    await UserCollection.updateOne(
      {
        _id: { $in: convertedId },
      },
      { $set: { name, description } }
    );

    return res.send({ message: "Users successfully updated" });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: "Something is wrong" });
  }
};
