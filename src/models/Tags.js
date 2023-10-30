const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema(
  {
    tags: {
      type: mongoose.Schema.Types.Mixed
    },
  },
  { versionKey: false }
);

const Tags = mongoose.model("Tags", TagsSchema);
module.exports = { Tags, TagsSchema };
