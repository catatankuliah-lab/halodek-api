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
    id_role,
    username,
    password,
    status_user
  ) => {
    const result = await sequelize.query(
      `
      INSERT INTO user (
        id_role, username, password, status_user
      ) VALUES (?, ?, ?, ?)
    `,
      {
        replacements: [
          id_role,
          username,
          password,
          status_user
        ],
      }
    );
    return result[0];
  },

  updateUser: async (id_user, userData) => {
    const { id_role, username, password, status_user } = userData;
    const [result] = await sequelize.query(
      `
      UPDATE user
      SET 
        id_role = ?,
        username = ?,
        password = ?,
        status_user = ?
      WHERE 
        id_user = ?
    `,
      {
        replacements: [
          id_role,
          username,
          password,
          status_user,
          id_user
        ],
      }
    );
    return result.affectedRows > 0;
  },
};

export default User;
