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
        users.*
      FROM 
        users
      WHERE 
        users.id_user = ?
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
    if (!id_user || typeof userData !== 'object') return false;

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return false;

    const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id_user = ?
  `;

    values.push(id_user);

    const [result] = await sequelize.query(query, { replacements: values });

    return result.affectedRows > 0;
  },

};

export default User;
