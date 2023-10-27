// const { IMG_WHITE_LIST } = require("@constants");

// const createItem = (req, res, next) => {
//   const {
//     body: { title, price, description, imgURL },
//   } = req;
//   const errors = [];

//   const trimmedTitle = title.trim();
//   if (!trimmedTitle) errors.push("Invalid title");

//   const trimmedDescription = description.trim();
//   if (!trimmedDescription) errors.push("Invalid description");

//   if (errors.length) {
//     return res.status(400).send({ errors });
//   }
//   return next();
// };
// module.exports = createItem;
