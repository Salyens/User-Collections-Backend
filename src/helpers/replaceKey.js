const replaceKey = (obj, oldKey, newKey) => {
  if (oldKey !== newKey) {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = { ...obj[oldKey] };
      delete obj[oldKey];
    }
  }
};
module.exports = replaceKey;
