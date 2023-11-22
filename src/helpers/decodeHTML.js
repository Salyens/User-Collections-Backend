const { decode } = require("html-entities");

const decodeHTML = (input) => {
  if (Array.isArray(input)) {
    return input.map(collection => {
      collection.description = decode(collection.description);
      return collection;
    });
  }
  if (input && typeof input === 'object') {
    input.description = decode(input.description);
    return input;
  }

  return input;
};

module.exports = decodeHTML;
