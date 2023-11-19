const validOneString = (value, key) => {
  const message = `The input ${key} should be a single line of text with no more than 256 characters. Please ensure your input meets these criteria.`;
  const isValid = /^.{0,256}$/.test(value);
  if (!isValid) {
    return message;
  }
  return false;
};

module.exports = validOneString;
