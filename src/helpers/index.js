const changeTagCounts = require("./tags/changeTagCounts");
const incrementTagCounts = require("./tags/changeTagCounts");
const removeLeadingHashes = require("./removeLeadingHashes");
const toTrim = require("./toTrim");
const compareTags = require("./compareTags");

module.exports = {
  removeLeadingHashes,
  incrementTagCounts,
  changeTagCounts,
  compareTags,
  toTrim,
};
