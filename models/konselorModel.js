import sequelize from "../config/config.js";

const Konselor = {

  getKonselorFilter: async (page = 1, per_page = 10, filters = {}) => {
    try {
      const offset = (page - 1) * per_page;
      let whereClause = "WHERE konselor.status = 'aktif'";
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.nama) {
        whereClause += " AND users.nama LIKE :nama";
        replacements.nama = `%${filters.nama}%`;
      }

      if (filters.no_hp) {
        whereClause += " AND users.no_hp LIKE :no_hp";
        replacements.no_hp = `%${filters.no_hp}%`;
      }

      if (filters.status) {
        whereClause += " AND konselor.status LIKE :status";
        replacements.status = `%${filters.status}%`;
      }

      const query = `
      SELECT
        users.id_user,
        users.nama,
        users.email,
        users.password,
        users.no_hp,
        users.role,
        users.status AS "status_user",
        konselor.id_konselor,
        konselor.id_user,
        konselor.foto_konselor,
        konselor.status AS "status_konselor"
      FROM
        konselor
      LEFT JOIN
        users ON konselor.id_user = users.id_user
      ${whereClause}
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM konselor
      LEFT JOIN
        users
      ON
        konselor.id_user = users.id_user
      ${whereClause};
    `;

      const [countResult] = await sequelize.query(countQuery, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      return {
        data,
        total: countResult.total,
        page,
        per_page,
      };
    } catch (error) {
      throw new Error("Error fetching paginated data: " + error.message);
    }
  },

  addKonselor: async (
    id_user,
    status,
    foto_konselor
  ) => {
    const result = await sequelize.query(
      `
    INSERT INTO konselor (
      id_user, status, foto_konselor
    ) VALUES (?, ?, ?)
    `,
      {
        replacements: [
          id_user,
          status,
          foto_konselor
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
          konselor.foto_konselor,
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

  getKonselorByIdUser: async (id_user) => {
    const [results] = await sequelize.query(
      `
        SELECT
          konselor.id_konselor,
          konselor.status AS 'status_konselor',
          konselor.foto_konselor,
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
          konselor.id_user = ?
      `,
      {
        replacements: [id_user],
      }
    );
    return results[0];
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
