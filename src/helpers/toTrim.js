const cleanHtml = require("./cleanHTML");

const toTrim = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const trimmedKey = key.trim();
    let value = obj[key];

    if (typeof value === "string") value = value.trim();
    else if (typeof value === "object" && value !== null) value = toTrim(value);

    if (key === "description") {
      value = cleanHtml(value)
    }
    acc[trimmedKey] = value;
    return acc;
  }, {});
};

module.exports = toTrim;
