import sequelize from "../config/config.js";

const Konselor = {
  addKonselor: async (
    id_user,
    status
  ) => {
    const result = await sequelize.query(
      `
    INSERT INTO konselor (
      id_user, status
    ) VALUES (?, ?)
    `,
      {
        replacements: [
          id_user,
          status
        ]
      }
    );
    return result[0];
  },

  getKonselorByIdKonselor: async (id_konselor) => {
    const [results] = await sequelize.query(
      `
        SELECT
          konselor.id_konselor,
          konselor.status AS 'status_konselor',
          users.id_user,
          users.nama,
          users.email,
          users.password,
          users.no_hp,
          users.role,
          users.status AS 'status_user'
        FROM
          konselor
        LEFT JOIN
          users ON konselor.id_user = users.id_user
        WHERE
          konselor.id_konselor = ?
      `,
      {
        replacements: [id_konselor],
      }
    );
    return results[0];
  },

  updateKonselorByIdKonselor: async (id_konselor, userData) => {
    const { status } = userData;
    const [result] = await sequelize.query(
      `
        UPDATE konselor
        SET
          status = ?
        WHERE 
          id_konselor = ?
    `,
      {
        replacements: [status, id_konselor],
      }
    );
    return result.affectedRows > 0;
  },

  updateKonselorByIdKonselor: async (id_konselor, userData) => {
    if (!id_konselor || typeof userData !== 'object') return false;

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return false;

    const query = `
    UPDATE konselor
    SET ${fields.join(', ')}
    WHERE id_konselor = ?
  `;

    values.push(id_konselor);

    const [result] = await sequelize.query(query, { replacements: values });

    return result.affectedRows > 0;
  },

};

export default Konselor;
