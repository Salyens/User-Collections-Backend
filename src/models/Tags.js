const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 1, required: true, unique: true },
  },
  { versionKey: false }
);
const Tags = mongoose.model("Tags", TagsSchema);
module.exports = { Tags, TagsSchema };
