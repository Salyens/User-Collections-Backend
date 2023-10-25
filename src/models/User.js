const mongoose = require("mongoose");

const UserSchemaShort = new mongoose.Schema(
  {
    name: { type: String, minlength: 1, required: true },
  },
  { versionKey: false }
);


const UserSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 1, required: true },
    password: { type: String, minlength: 6, required: true },
    email: { type: String, unique: true, minlength: 5, required: true },
    lastLogin: { type: Object, required: true, default: 0 },
    role: { type: String, default: "user" },
  },
  { versionKey: false }
);
const User = mongoose.model("User", UserSchema);
module.exports = { User, UserSchema, UserSchemaShort };
