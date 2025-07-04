import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import multer from "multer";
const upload = multer();

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      status: "success",
      data: users,
      message: "Users fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  const { id_user } = req.params;

  try {
    const user = await User.getUserById(id_user);
    if (user) {
      res.status(200).json({
        status: "success",
        data: user,
        message: "User fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const createUser = async (req, res) => {
  const { nama, email, password, no_hp, role } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    const id_user = await User.addUser(nama, email, hashedPassword, no_hp, role);
    res.status(201).json({
      status: "success",
      data: {
        id_user
      },
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: "error",
      data: null,
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  const { id_user } = req.params;
  const userData = { ...req.body };

  try {
    if (userData.password) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }

    const updatedUser = await User.updateUser(id_user, userData);
    res.status(200).json({
      status: "success",
      data: updatedUser,
      message: "User updated successfully."
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};