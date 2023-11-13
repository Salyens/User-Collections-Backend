const validOneString = (value, errors) => {
  const isValid = /^.{0,256}$/.test(value);
  if (!isValid) {
    errors.push(
      "The input should be a single line of text with no more than 256 characters. Please ensure your input meets these criteria."
    );
    return errors;
  }
};

module.exports = validOneString;
