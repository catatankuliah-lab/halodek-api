import Role from "../models/roleModel.js";

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAllRoles();
    res.status(200).json({
      status: "success",
      data: roles,
      message: "Roles retrieved successfully.",
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
