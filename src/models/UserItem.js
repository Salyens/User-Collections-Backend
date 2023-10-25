const mongoose = require("mongoose");
const { UserSchemaShort } = require("./User");

const UserItemSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 1, required: true, unique: true },
    collectionName: { type: String, required: true},
    user: { type: UserSchemaShort, required: true },
    imgURL: { type: String, minlength: 1 },
    tags: { type: Array, minlength: 1, required: true },
    comments: {type: Array, default: [], required: true},
    likes: { type: Array, default: [], required: true },
  },
  { versionKey: false }
);

const UserItem = mongoose.model("UserItem", UserItemSchema);
module.exports = { UserItem, UserItemSchema };
