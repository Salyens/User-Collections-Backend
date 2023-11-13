const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/security");
const { User } = require("../models/User");
const { default: mongoose } = require("mongoose");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ role: 1 });
    return res.send({ users });
  } catch (_) {
    return res.status(400).send({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).send({ message: "Invalid email or password" });

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch)
      return res.status(401).send({ message: "Invalid email or password" });

    await User.updateOne({ email }, { lastLogin: Date.now() });

    const accessToken = generateToken(
      {
        email: foundUser.email,
        _id: foundUser._id,
        status: foundUser.status,
        name: foundUser.name,
        role: foundUser.role,
      },
      "24h"
    );

    return res.send({ accessToken });
  } catch (_) {
    return res.status(400).send({
      message: "Something went wrong while processing the login request",
    });
  }
};

exports.registration = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.password, +process.env.SALT);
    const { email, name, role } = req.body;

    const newUser = await User.create({ ...req.body, password });
    const accessToken = generateToken(
      { email, _id: newUser._id, name, role },
      "24h"
    );
    return res.send({ accessToken });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send({ message: "Email already exists" });
    }
    return res
      .status(400)
      .send({ message: "Something went wrong during registration" });
  }
};

exports.update = async (req, res) => {
  try {
    const { blockStatus, role: userRole, ids } = req.body;
    const updateUsers = async (field, value) => {
      await User.updateMany(
        {
          _id: { $in: ids },
        },
        { $set: { [field]: value } }
      );
    };

    if (blockStatus) updateUsers("status", true);
    else if ("blockStatus" in req.body && !blockStatus)
      updateUsers("status", false);

    if (userRole === "admin" || userRole === "user")
      updateUsers("role", userRole);
    else return res.send({ message: "Invalid role" });

    return res.send({ message: "Users successfully updated" });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { ids } = req.body;

    const { deletedCount } = await User.deleteMany({
      _id: { $in: ids },
    });
    if (!deletedCount)
      return res.status(404).send({ message: "Users is not found" });
    return res.send({ message: "Users successfully deleted" });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};
