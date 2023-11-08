const toTrim = (fields) => {
  const trimmedObject = {};
  for (const key in fields) {
    trimmedObject[key] = fields[key].trim();
  }
  return trimmedObject;
};
module.exports = toTrim;
