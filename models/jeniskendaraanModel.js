import sequelize from "../config/config.js";

const JenisKendaraan = {
  // Mendapatkan semua jenis kendaraan
  getAllJenisKendaraan: async () => {
    const [results] = await sequelize.query(`
      SELECT * FROM jenis_kendaraan
    `);
    return results;
  },

  getJenisKendaraanById: async (id_jenis_kendaraan) => {
    const [results] = await sequelize.query(
      `
      SELECT * FROM jenis_kendaraan
      WHERE id_jenis_kendaraan = ?
      `,
      {
        replacements: [id_jenis_kendaraan],
      }
    );
    return results[0];
  },

};

export default JenisKendaraan;