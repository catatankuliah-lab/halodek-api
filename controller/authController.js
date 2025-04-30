import sequelize from "../config/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [user] = await sequelize.query(
      `SELECT user.*, role.* FROM
        user
      LEFT JOIN
        role ON user.id_role = role.id_role
      WHERE
        username = :username`,
      {
        replacements: { username },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log(user);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Username atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Username atau password salah.",
      });
    }

    const token = jwt.sign(
      { id_user: user.id_user, id_role: user.id_role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({
      status: "success",
      message: "Login berhasil.",
      data: user,
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
