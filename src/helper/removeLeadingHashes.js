const removeLeadingHashes = (tags) => {
  return tags.map((tag) => tag.replace(/^#+/, ""));
};
module.exports = removeLeadingHashes;
