const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema(
  {
    tags: {
      type: Map,
      of: Number,
      default: {}
    },
  },
  { versionKey: false }
);

const Tags = mongoose.model("Tags", TagsSchema);
module.exports = { Tags, TagsSchema };
