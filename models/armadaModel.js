import sequelize from "../config/config.js";

const Armada = {
  // Get all Armada
  getAllArmada: async (page = 1, per_page = 10, filters = {}) => {
    try {
      const offset = (page - 1) * per_page;
      let whereClause = "WHERE 1=1";
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.nama_jenis_kendaraan) {
        whereClause += " AND jenis_kendaraan.nama_jenis_kendaraan LIKE :nama_jenis_kendaraan";
        replacements.nama_jenis_kendaraan = `%${filters.nama_jenis_kendaraan}%`;
      }

      if (filters.nopol_armada) {
        whereClause += " AND armada.nopol_armada LIKE :nopol_armada";
        replacements.nopol_armada = `%${filters.nopol_armada}%`;
      }

      if (filters.status_armada) {
        whereClause += " AND armada.status_armada LIKE :status_armada";
        replacements.status_armada = `%${filters.status_armada}%`;
      }

      const query = `
        SELECT
          armada.id_armada,
          armada.id_jenis_kendaraan,
          armada.nopol_armada,
          armada.lokasi_terakhir,
          armada.status_armada,
          jenis_kendaraan.nama_jenis_kendaraan
        FROM
          armada
        LEFT JOIN
          jenis_kendaraan
        ON
          armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
        ${whereClause}
      LIMIT :per_page OFFSET :offset;
      `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM armada
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

  getAllArmadaDetailPage: async (id_armada) => {
    const [results] = await sequelize.query(
      `
      SELECT
        armada.*,
        jenis_kendaraan.nama_jenis_kendaraan
      FROM armada
      JOIN
        jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      WHERE status_armada = 'TERSEDIA'
      OR id_armada = ?
    `,
      { replacements: [id_armada] }
    );
    return results;
  },


  getAllArmadas: async () => {
    const [results] = await sequelize.query(`
      SELECT
        armada.*,
        jenis_kendaraan.nama_jenis_kendaraan
      FROM armada
      LEFT JOIN
        jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      WHERE status_armada = 'TERSEDIA'
    `);
    return results;
  },

  // Get Armada by ID
  getArmadaById: async (id_armada) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_armada,
        id_jenis_kendaraan,
        nopol_armada,
        lokasi_terakhir,
        status_armada
      FROM armada
      WHERE id_armada = ?
    `,
      { replacements: [id_armada] }
    );
    return results[0];
  },

  // Get Armada by Jenis Kendaraan ID
  getArmadaByJenisKendaraan: async (id_jenis_kendaraan) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_armada,
        id_jenis_kendaraan,
        nopol_armada,
        lokasi_terakhir,
        status_armada
      FROM armada
      WHERE id_jenis_kendaraan = ?
    `,
      { replacements: [id_jenis_kendaraan] }
    );
    return results;
  },

  // Get Armada by Nopol
  getArmadaByNopol: async (nopol_armada) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_armada,
        id_jenis_kendaraan,
        nopol_armada,
        lokasi_terakhir,
        status_armada
      FROM armada
      WHERE nopol_armada = ?
    `,
      { replacements: [nopol_armada] }
    );
    return results;
  },

  // Add a new Armada
  addArmada: async (armadaData) => {
    const { id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada } = armadaData;
    const [result] = await sequelize.query(
      `
      INSERT INTO armada (id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada)
      VALUES (?, ?, ?, ?)
    `,
      {
        replacements: [id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada],
      }
    );
    return { id_armada: result.insertId, ...armadaData };
  },

  // Memperbarui Status Armada
  updateStatusArmada: async (id_armada, armadaData) => {
    const { status_armada } = armadaData;
    const [result] = await sequelize.query(
      `
          UPDATE armada
          SET status_armada = ?
          WHERE id_armada = ?
        `,
      {
        replacements: [status_armada, id_armada],
      }
    );
    return result.affectedRows > 0;
  },

  // Update Armada
  updateArmada: async (id_armada, armadaData) => {
    const { id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada } = armadaData;
    const [result] = await sequelize.query(
      `
      UPDATE armada
      SET id_jenis_kendaraan = ?, nopol_armada = ?, lokasi_terakhir = ?, status_armada = ?
      WHERE id_armada = ?
    `,
      {
        replacements: [id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada, id_armada],
      }
    );
    return result.affectedRows > 0;
  },

  // Delete Armada
  deleteArmada: async (id_armada) => {
    const [result] = await sequelize.query(
      `DELETE FROM armada WHERE id_armada = ?`,
      { replacements: [id_armada] }
    );
    return result.affectedRows > 0;
  },

  getArmadaAvailability: async () => {
    const [tersedia] = await sequelize.query("SELECT COUNT(*) AS tersedia FROM armada WHERE status_armada = 'TERSEDIA';");
    console.log(tersedia);
    const [muat] = await sequelize.query("SELECT COUNT(*) AS muat FROM armada WHERE status_armada = 'MUAT';");
    console.log(muat);
    const [bongkar] = await sequelize.query("SELECT COUNT(*) AS bongkar FROM armada WHERE status_armada = 'BONGKAR';");
    console.log(bongkar);
    const [selesai] = await sequelize.query("SELECT COUNT(*) AS selesai FROM armada WHERE status_armada = 'SELESAI';");
    console.log(selesai);

    return { tersedia, muat, bongkar, selesai };
  },

  getArmadaRiwayatBulanan: async (page = 1, per_page = 10, filters = {}) => {
    try {
      const offset = (page - 1) * per_page;
      let whereClause = "WHERE 1=1";
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.nopol_armada) {
        whereClause += " AND armada.nopol_armada LIKE :nopol_armada";
        replacements.nopol_armada = `%${filters.nopol_armada}%`;
      }

      if (filters.srtatus_armada) {
        whereClause += " AND armada.srtatus_armada LIKE :srtatus_armada";
        replacements.srtatus_armada = `%${filters.srtatus_armada}%`;
      }

      if (filters.id_jenis_kendaraan) {
        whereClause += " AND jenis_kendaraan.id_jenis_kendaraan LIKE :id_jenis_kendaraan";
        replacements.id_jenis_kendaraan = `%${filters.id_jenis_kendaraan}%`;
      }

      const query = `
      SELECT
      armada.*,
      COALESCE(
          (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                  'id_po', p.id_po,
                  'nomor_po', p.nomor_po,
                  'tanggal_po', p.tanggal_po
              )
          )
          FROM (
              SELECT *
              FROM po
              WHERE po.id_armada = armada.id_armada
                AND MONTH(po.tanggal_po) = ${filters.bulan}
                AND YEAR(po.tanggal_po) = ${filters.tahun}
              ORDER BY po.tanggal_po ASC
          ) p
          ), '[]'
      ) AS daftar_po
      FROM armada
      JOIN jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      ${whereClause}
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM armada
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
  }
};

export default Armada;
