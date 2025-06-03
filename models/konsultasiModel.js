import sequelize from "../config/config.js";

const Konsultasi = {

  getKonsultasiByIdUserFilter: async (id_user, page = 1, per_page = 10, filters = {}) => {
    try {
      console.log(filters);
      const offset = (page - 1) * per_page;
      let whereClause = `WHERE konsultasi.oleh_id = '${id_user}'`;
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.topik) {
        whereClause += " AND konsultasi.topik LIKE :topik";
        replacements.topik = `%${filters.topik}%`;
      }

      if (filters.target) {
        whereClause += " AND konsultasi.kepada_role LIKE :target";
        replacements.target = `%${filters.target}%`;
      }

      if (filters.status) {
        whereClause += " AND konsultasi.status LIKE :status";
        replacements.status = `%${filters.status}%`;
      }

      const query = `
      SELECT
        konsultasi.id_konsultasi,
        konsultasi.tanggal,
        konsultasi.topik,
        konsultasi.oleh_role,
        konsultasi.oleh_id,
        konsultasi.kepada_role,
        konsultasi.kepada_id,
        konsultasi.status,
        konsultasi.created_at,
        konsultasi.updated_at,
        pengirim_user.nama AS nama_pengirim,
        penerima_user.nama AS nama_penerima
      FROM konsultasi
      LEFT JOIN users AS pengirim_user ON konsultasi.oleh_id = pengirim_user.id_user
      LEFT JOIN users AS penerima_user ON konsultasi.kepada_id = penerima_user.id_user
      ${whereClause}
      ORDER BY konsultasi.status DESC
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM konsultasi
      LEFT JOIN
        users
      ON
        konsultasi.oleh_id = users.id_user
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

  getKonsultasiByIdUserFilterKonselor: async (id_user, page = 1, per_page = 10, filters = {}) => {
    try {
      console.log(filters);
      const offset = (page - 1) * per_page;
      let whereClause = `WHERE konsultasi.kepada_id = '${id_user}'`;
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.topik) {
        whereClause += " AND konsultasi.topik LIKE :topik";
        replacements.topik = `%${filters.topik}%`;
      }

      if (filters.target) {
        whereClause += " AND konsultasi.kepada_role LIKE :target";
        replacements.target = `%${filters.target}%`;
      }

      if (filters.status) {
        whereClause += " AND konsultasi.status LIKE :status";
        replacements.status = `%${filters.status}%`;
      }

      const query = `
      SELECT
        konsultasi.id_konsultasi,
        konsultasi.tanggal,
        konsultasi.topik,
        konsultasi.oleh_role,
        konsultasi.oleh_id,
        konsultasi.kepada_role,
        konsultasi.kepada_id,
        konsultasi.status,
        konsultasi.created_at,
        konsultasi.updated_at,
        pengirim_user.nama AS nama_pengirim,
        penerima_user.nama AS nama_penerima
      FROM konsultasi
      LEFT JOIN users AS pengirim_user ON konsultasi.oleh_id = pengirim_user.id_user
      LEFT JOIN users AS penerima_user ON konsultasi.kepada_id = penerima_user.id_user
      ${whereClause}
      ORDER BY konsultasi.status DESC
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM konsultasi
      LEFT JOIN
        users
      ON
        konsultasi.kepada_id = users.id_user
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

  createKonsultasi: async (
    topik,
    oleh_role,
    oleh_id,
    kepada_role,
    kepada_id
  ) => {
    const result = await sequelize.query(
      `
        INSERT INTO konsultasi (
          topik, oleh_role, oleh_id, kepada_role, kepada_id
        ) VALUES (?, ?, ?, ?, ?)
      `,
      {
        replacements: [
          topik,
          oleh_role,
          oleh_id,
          kepada_role,
          kepada_id
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

export default Konsultasi;
