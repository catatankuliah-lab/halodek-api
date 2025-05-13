import sequelize from "../config/config.js";

const User = {
  // Mendapatkan semua user dengan join tabel role
  getAllUsers: async () => {
    const [results] = await sequelize.query(`
      SELECT
        user.*,
        role.nama_role
      FROM user
      LEFT JOIN
        role ON user.id_role = role.id_role
    `);
    return results;
  },

  getUserById: async (id_user) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        user.*,
        role.nama_role
      FROM 
        user
      LEFT JOIN 
        role ON user.id_role = role.id_role
      WHERE 
        user.id_user = ?
      `,
      {
        replacements: [id_user],
      }
    );
    return results[0];
  },

  addUser: async (
    nama,
    email,
    password,
    no_hp,
    role
  ) => {
    const result = await sequelize.query(
      `
    INSERT INTO users (
      nama, email, password, no_hp, role
    ) VALUES (?, ?, ?, ?, ?)
    `,
      {
        replacements: [
          nama,
          email,
          password,
          no_hp,
          role
        ]
      }
    );
    return result[0];
  },

  updateUser: async (id_user, userData) => {
    const {
      nama,
      email,
      password,
      no_hp,
      role
    } = userData;
    const [result] = await sequelize.query(
      `
      UPDATE users
      SET
        nama = ?,
        email = ?,
        password = ?,
        no_hp = ?,
        role = ?
      WHERE 
        id_user = ?
    `,
      {
        replacements: [
          nama,
          email,
          password,
          no_hp,
          role,
          id_user
        ],
      }
    );
    return result.affectedRows > 0;
  },
};

export default User;
