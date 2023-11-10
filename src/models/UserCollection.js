const mongoose = require("mongoose");

const UserCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 1, required: true, unique: true },
    description: { type: String, required: true },
    theme: { type: String, required: true },
    counter: { type: Number, required: true, default: 0 },
    imgURL: { type: String, minlength: 1 },
    additionalFields: { type: mongoose.Schema.Types.Mixed }
  },
  { versionKey: false }
);
const UserCollection = mongoose.model("UserCollection", UserCollectionSchema);
module.exports = { UserCollection, UserCollectionSchema };
