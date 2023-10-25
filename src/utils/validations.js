const validator = require("validator");

// const validName = (name) => {
//     const regex = new RegExp(/^[a-z]+ [a-z]+$/i);
//     return regex.test(name);
//   };
  
  const validEmail = (email) => validator.isEmail(email)

  const validPassword = (password) => {
    const regex = new RegExp(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])([A-Za-z0-9!@#$%^&*]{8,})$/
    );
    return regex.test(password);
  };
  
  module.exports = { validEmail, validPassword };
  