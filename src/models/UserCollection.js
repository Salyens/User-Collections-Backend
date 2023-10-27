const mongoose = require("mongoose");
const UserCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 1, required: true, unique: true},
    userId:{type: mongoose.Schema.Types.ObjectId},
    imgURL: { type: String, minlength: 1 },
    description: { type: String, minlength: 1, required: true}
  },
  { versionKey: false }
);
const UserCollection = mongoose.model("UserCollection", UserCollectionSchema);
module.exports = { UserCollection, UserCollectionSchema };
