import sequelize from "../config/config.js";

const PA = {

  getPAFilter: async (page = 1, per_page = 10, filters = {}) => {
    try {
      const offset = (page - 1) * per_page;
      let whereClause = "WHERE pembimbing_akademik.status = 'aktif'";
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
        whereClause += " AND pembimbing_akademik.status LIKE :status";
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
        pembimbing_akademik.id_pa,
        pembimbing_akademik.id_user,
        pembimbing_akademik.foto_pa,
        pembimbing_akademik.jumlah_mahasiswa_aktif,
        pembimbing_akademik.status AS "status_pembimbing_akademik"
      FROM
        pembimbing_akademik
      LEFT JOIN
        users ON pembimbing_akademik.id_user = users.id_user
      ${whereClause}
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM pembimbing_akademik
      LEFT JOIN
        users
      ON
        pembimbing_akademik.id_user = users.id_user
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

  addPA: async (
    id_user,
    jumlah_mahasiswa_aktif,
    status
  ) => {
    const result = await sequelize.query(
      `
    INSERT INTO pembimbing_akademik (
      id_user, jumlah_mahasiswa_aktif, status
    ) VALUES (?, ?, ?)
    `,
      {
        replacements: [
          id_user,
          jumlah_mahasiswa_aktif,
          status
        ]
      }
    );
    return result[0];
  },

  getPAByIdPA: async (id_pa) => {
    const [results] = await sequelize.query(
      `
        SELECT
          pembimbing_akademik.id_pa,
          pembimbing_akademik.foto_pa,
          pembimbing_akademik.jumlah_mahasiswa_aktif,
          pembimbing_akademik.status AS 'status_pa',
          users.id_user,
          users.nama,
          users.email,
          users.password,
          users.no_hp,
          users.role,
          users.status AS 'status_user'
        FROM
          pembimbing_akademik
        LEFT JOIN
          users ON pembimbing_akademik.id_user = users.id_user
        WHERE
          pembimbing_akademik.id_pa = ?
      `,
      {
        replacements: [id_pa],
      }
    );
    return results[0];
  },

  updatePAByIdPA: async (id_pa, userData) => {
    if (!id_pa || typeof userData !== 'object') return false;

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return false;

    const query = `
    UPDATE pembimbing_akademik
    SET ${fields.join(', ')}
    WHERE id_pa = ?
  `;

    values.push(id_pa);

    const [result] = await sequelize.query(query, { replacements: values });

    return result.affectedRows > 0;
  },

};

export default PA;
