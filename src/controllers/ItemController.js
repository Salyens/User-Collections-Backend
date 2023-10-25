const { default: mongoose } = require("mongoose");

const { UserCollection } = require("../models/UserCollection");
const { UserItem } = require("../models/UserItem");
const { Tags } = require("../models/Tags");

// exports.getAllCollections = async (req, res) => {
//   try {
//     const collections = await Collection.find();
//     return res.send({ collections });
//   } catch (_) {
//     return res.status(400).send({ message: "Something went wrong" });
//   }
// };

exports.create = async (req, res) => {
  try {
    const { _id, name } = req.user;
    const { name: itemName, imgURL, tags, collectionId } = req.body;
    const userCollection = await UserCollection.findById(collectionId);

    if (!userCollection)
      return res.status(404).send({ message: "Collection is not found" });

    const wholeItemInfo = {
      name: itemName,
      imgURL,
      tags,
      collectionName: userCollection.name,
      user: { _id, name },
    };

    const newItem = await UserItem.create(wholeItemInfo);
    createNewTags(tags);
    return res.send(newItem);
  } catch (_) {

    return res.status(400).send({ message: "Something is wrong" });
  }
};

const createNewTags = async (tags) => {
  try {
    const tagsCollection = tags.map((tag) => ({ name: tag }));
    await Tags.insertMany(tagsCollection, { ordered: false });
  } catch (error) {
    
  }

}

// exports.delete = async (req, res) => {
//   try {
//     const ObjectId = mongoose.Types.ObjectId;
//     const { idsToDelete } = req.body;
//     const convertedIds = idsToDelete.map((id) => new ObjectId(id));

//     const { deletedCount } = await Collection.deleteMany({
//       _id: { $in: convertedIds },
//     });
//     if (!deletedCount)
//       return res.status(404).send({ message: "Users is not found" });
//     return res.send({ message: "Users successfully deleted" });
//   } catch (_) {
//     return res.status(400).send({ message: "Something is wrong" });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const ObjectId = mongoose.Types.ObjectId;
//     const { id, name, description } = req.body;
//     const convertedId = new ObjectId(id);
//     await Collection.updateOne(
//       {
//         _id: { $in: convertedId },
//       },
//       { $set: { name, description } }
//     );

//     return res.send({ message: "Users successfully updated" });
//   } catch (e) {
//     console.log(e);
//     return res.status(400).send({ message: "Something is wrong" });
//   }
// };
