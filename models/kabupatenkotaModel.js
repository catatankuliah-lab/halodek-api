import sequelize from "../config/config.js";

const KabupatenKota = {
  // Mendapatkan semua kabupaten/kota
  getAllKabupatenKota: async () => {
    const [results] = await sequelize.query(`
      SELECT 
        id_kabupaten_kota, 
        kode_kabupaten_kota, 
        nama_kabupaten_kota
      FROM 
        kabupaten_kota
    `);
    return results;
  },

  // Mendapatkan kabupaten/kota berdasarkan ID
  getKabupatenKotaById: async (id_kabupaten_kota) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_kabupaten_kota, 
        kode_kabupaten_kota, 
        nama_kabupaten_kota
      FROM 
        kabupaten_kota
      WHERE 
        id_kabupaten_kota = ?
    `,
      {
        replacements: [id_kabupaten_kota],
      }
    );
    return results[0];
  },

  // Menambahkan kabupaten/kota baru
  addKabupatenKota: async (kode_kabupaten_kota, nama_kabupaten_kota) => {
    const result = await sequelize.query(
      `
      INSERT INTO kabupaten_kota (
        kode_kabupaten_kota, nama_kabupaten_kota
      ) VALUES (?, ?)
    `,
      {
        replacements: [kode_kabupaten_kota, nama_kabupaten_kota],
      }
    );
    return result[0];
  },

  // Mengupdate data kabupaten/kota
  updateKabupatenKota: async (id_kabupaten_kota, kabupatenKotaData) => {
    const { kode_kabupaten_kota, nama_kabupaten_kota } = kabupatenKotaData;
    const [result] = await sequelize.query(
      `
      UPDATE kabupaten_kota
      SET 
        kode_kabupaten_kota = ?,
        nama_kabupaten_kota = ?
      WHERE 
        id_kabupaten_kota = ?
    `,
      {
        replacements: [kode_kabupaten_kota, nama_kabupaten_kota, id_kabupaten_kota],
      }
    );
    return result.affectedRows > 0;
  },
};

export default KabupatenKota;
