import sequelize from "../config/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await sequelize.query(
      `SELECT users.* FROM
        users
      WHERE
        email = :email`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!users) {
      return res.status(401).json({
        status: "error",
        message: "email atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "email atau password salah.",
      });
    }

    const token = jwt.sign(
      { id_users: users.id_users, role: users.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({
      status: "success",
      message: "Login berhasil.",
      data: users,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat memproses permintaan.",
    });
  }
};
