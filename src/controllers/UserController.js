const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/security");
const { User } = require("../models/User");
const { default: mongoose } = require("mongoose");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ role: 1 });
    return res.send(users);
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

    if (foundUser.status) {
      return res.status(403).send({
        message:
          "Your access is temporarily restricted. Please contact support for further details.",
      });
    }

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
    const { email, name } = req.body;
    const newUser = await User.create({ ...req.body, password });
    const accessToken = generateToken(
      { email, _id: newUser._id, name, role: "user" },

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
    const { blockStatus, ids } = req.body;
    const { role: userRole } = req.user;
    if (userRole !== "admin" && userRole !== "root") {
      return res.status(403).send({
        message:
          "Access denied. You must have admin or root privileges to view this page.",
      });
    }

    const usersToUpdate = await User.find({
      _id: { $in: ids },
    });

    const finalListToDelete = usersToUpdate
      .filter((user) => user.role !== userRole && user.role !== "root")
      .map((user) => user._id);

    if (ids.length !== finalListToDelete.length) {
      return res.status(404).send({
        message:
          "Some users could not be changed due to insufficient permissions or they do not exist.",
      });
    }

    await User.updateMany(
      {
        _id: { $in: ids },
      },
      { $set: { status: blockStatus } }
    );

    const updatedUsers = await User.find({
      _id: { $in: ids },
    });

    return res.send(updatedUsers);
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { ids } = req.body;
    const { role: userRole } = req.user;
    if (userRole !== "admin" && userRole !== "root") {
      return res.status(403).send({
        message:
          "Access denied. You must have admin or root privileges to view this page.",
      });
    }

    const usersToDelete = await User.find({
      _id: { $in: ids },
    });

    const finalListToDelete = usersToDelete
      .filter((user) => user.role !== userRole && user.role !== "root")
      .map((user) => user._id);

    if (ids.length !== finalListToDelete.length) {
      return res.status(404).send({
        message:
          "Some users could not be deleted due to insufficient permissions or they do not exist.",
      });
    }
    const { deletedCount } = await User.deleteMany({
      _id: { $in: finalListToDelete },
    });

    if (!deletedCount) {
      return res.send({ message: "Users are not found" });
    }

    return res.send({ message: "Users successfully deleted" });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};
