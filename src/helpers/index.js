const changeTagCounts = require("./tags/changeTagCounts");
const incrementTagCounts = require("./tags/changeTagCounts");
const compareTags = require("./compareTags");
const removeLeadingHashes = require("./removeLeadingHashes");
const toTrim = require("./toTrim");

module.exports = {
  removeLeadingHashes,
  incrementTagCounts,
  changeTagCounts,
  compareTags,
  toTrim,
};
