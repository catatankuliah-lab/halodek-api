import sequelize from "../config/config.js";
import { uploadTitikBongkar } from "../controller/titikbongkarController.js";

const TitikBongkar = {
  // Mendapatkan semua titik bongkar
  getAllTitikBongkar: async () => {
    const [results] = await sequelize.query(`
      SELECT 
        id_titik_bongkar,
        id_po,
        id_kabupaten_kota,
        alamat_titik_bongkar,
        jam_bongkar
      FROM titik_bongkar
    `);
    return results;
  },

  // Mendapatkan titik bongkar berdasarkan ID
  getTitikBongkarById: async (id_titik_bongkar) => {
    const [results] = await sequelize.query(
      `
      SELECT 
      titik_bongkar.*,
      po.nomor_po,
      po.tanggal_po
      FROM titik_bongkar
      JOIN po ON titik_bongkar.id_po = po.id_po
      WHERE id_titik_bongkar = ?
    `,
      { replacements: [id_titik_bongkar] }
    );
    return results[0];
  },

  // Mendapatkan titik bongkar berdasarkan ID PO
  getTitikBongkarByPO: async (id_po) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        titik_bongkar.id_titik_bongkar,
        titik_bongkar.id_po,
        titik_bongkar.id_kabupaten_kota,
        titik_bongkar.alamat_titik_bongkar,
        titik_bongkar.jam_bongkar,
        titik_bongkar.shareloc,
        titik_bongkar.nama_penerima,
        titik_bongkar.nomor_penerima,
        kabupaten_kota.nama_kabupaten_kota
      FROM titik_bongkar
      JOIN kabupaten_kota ON titik_bongkar.id_kabupaten_kota = kabupaten_kota.id_kabupaten_kota
      WHERE id_po = ?
    `,
      { replacements: [id_po] }
    );
    return results;
  },

  // Menambahkan titik bongkar baru

  addTitikBongkar: async (id_po, id_kabupaten_kota, alamat_titik_bongkar, jam_bongkar, shareloc, nama_penerima, nomor_penerima) => {
    // console.log("Received data:", titikBongkarData);

    const result = await sequelize.query(
      `
      INSERT INTO titik_bongkar (id_po, id_kabupaten_kota, alamat_titik_bongkar, jam_bongkar, shareloc, nama_penerima, nomor_penerima)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      {
        replacements: [id_po, id_kabupaten_kota, alamat_titik_bongkar, jam_bongkar, shareloc, nama_penerima, nomor_penerima],
      }
    );
    return result[0];
  },

  // Memperbarui titik bongkar
  updateTitikBongkar: async (id_titik_bongkar, titikBongkarData) => {
    const { id_po, id_kabupaten_kota, alamat_titik_bongkar, jam_bongkar } = titikBongkarData;
    const [result] = await sequelize.query(
      `
      UPDATE titik_bongkar
      SET id_po = ?, id_kabupaten_kota = ?, alamat_titik_bongkar = ?, jam_bongkar = ?
      WHERE id_titik_bongkar = ?
    `,
      {
        replacements: [id_po, id_kabupaten_kota, alamat_titik_bongkar, jam_bongkar, id_titik_bongkar],
      }
    );
    return result.affectedRows > 0;
  },

  // Menghapus titik bongkar
  deleteTitikBongkar: async (id_titik_bongkar) => {
    const [result] = await sequelize.query(
      `DELETE FROM titik_bongkar WHERE id_titik_bongkar = ?`,
      { replacements: [id_titik_bongkar] }
    );
    return result.affectedRows > 0;
  },

  uploadTitikBongkar: async (id_titik_bongkar, FileFoto) => {
    const [result] = await sequelize.query(
      `
      UPDATE titik_bongkar
      SET foto_bongkar = ?
      WHERE id_titik_bongkar = ?
    `,
      {
        replacements: [FileFoto, id_titik_bongkar],
      }
    );
    return result.affectedRows > 0;
  }
};

export default TitikBongkar;
