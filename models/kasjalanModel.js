import sequelize from "../config/config.js";

const Kasjalan = {
  // Get all Kasjalan
  getAllKasjalan: async () => {
    const [results] = await sequelize.query(`
      SELECT 
        kas_jalan.id_kas_jalan,
        kas_jalan.id_po,
        kas_jalan.jenis_kas_jalan,
        kas_jalan.jarak_isi,
        kas_jalan.jarak_kosong,
        kas_jalan.jam_tunggu,
        kas_jalan.gaji_driver,
        kas_jalan.e_toll,
        kas_jalan.keterangan_rute,
        kas_jalan.tonase,
        kas_jalan.status_kas_jalan
      FROM 
        kas_jalan
    `);
    return results;
  },

  // Get Kasjalan by ID
  getKasjalanById: async (id_kas_jalan) => {
    const [results] = await sequelize.query(`
      SELECT 
        kas_jalan.id_kas_jalan,
        kas_jalan.id_po,
        kas_jalan.jenis_kas_jalan,
        kas_jalan.jarak_isi,
        kas_jalan.jarak_kosong,
        kas_jalan.jam_tunggu,
        kas_jalan.gaji_driver,
        kas_jalan.e_toll,
        kas_jalan.keterangan_rute,
        kas_jalan.tonase,
        kas_jalan.status_kas_jalan,  
        po.tanggal_po,
        po.customer,
        po.titik_muat,
        po.titik_bongkar
      FROM 
        kas_jalan
      LEFT JOIN 
        po ON kas_jalan.id_po = po.id_po
      WHERE 
        kas_jalan.id_kas_jalan = ?
    `, {
      replacements: [id_kas_jalan],
    });
    return results[0];
  },

  // Get Kasjalan by PO ID
  getKasjalanByIdPO: async (id_po) => {
    const [results] = await sequelize.query(`
      SELECT 
        kas_jalan.id_kas_jalan,
        kas_jalan.id_po,
        kas_jalan.jenis_kas_jalan,
        kas_jalan.jarak_isi,
        kas_jalan.jarak_kosong,
        kas_jalan.jam_tunggu,
        kas_jalan.gaji_driver,
        kas_jalan.e_toll,
        kas_jalan.keterangan_rute,
        kas_jalan.tonase,
        kas_jalan.status_kas_jalan,  
        po.tanggal_po,
        po.customer,
        po.titik_muat,
        po.titik_bongkar
      FROM 
        kas_jalan
      LEFT JOIN 
        po ON kas_jalan.id_po = po.id_po
      WHERE 
        kas_jalan.id_po = ?
    `, {
      replacements: [id_po],
    });
    return results;
  },

  // Add a new Kasjalan
  addKasjalan: async (kasjalanData) => {
    const {
      id_po,
      jenis_kas_jalan,
      jarak_isi,
      jarak_kosong,
      jam_tunggu,
      gaji_driver,
      e_toll,
      keterangan_rute,
      tonase,
      status_kas_jalan  // Added field
    } = kasjalanData;
    const [result] = await sequelize.query(`
      INSERT INTO kas_jalan 
        (id_po, jenis_kas_jalan, jarak_isi, jarak_kosong, jam_tunggu, gaji_driver, e_toll, keterangan_rute, tonase, status_kas_jalan)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        id_po,
        jenis_kas_jalan,
        jarak_isi,
        jarak_kosong,
        jam_tunggu,
        gaji_driver,
        e_toll,
        keterangan_rute,
        tonase,
        status_kas_jalan  // Added field
      ],
    });
    return { id_kas_jalan: result.insertId, ...kasjalanData };
  },

  // Update Kasjalan
  updateKasjalan: async (id_kas_jalan, kasjalanData) => {
    const {
      id_po,
      jenis_kas_jalan,
      jarak_isi,
      jarak_kosong,
      jam_tunggu,
      gaji_driver,
      e_toll,
      keterangan_rute,
      tonase,
      status_kas_jalan  // Added field
    } = kasjalanData;
    const [result] = await sequelize.query(`
      UPDATE kas_jalan
      SET 
        id_po = ?, 
        jenis_kas_jalan = ?, 
        jarak_isi = ?, 
        jarak_kosong = ?, 
        jam_tunggu = ?, 
        gaji_driver = ?, 
        e_toll = ?, 
        keterangan_rute = ?, 
        tonase = ?, 
        status_kas_jalan = ?  
      WHERE 
        id_kas_jalan = ?
    `, {
      replacements: [
        id_po,
        jenis_kas_jalan,
        jarak_isi,
        jarak_kosong,
        jam_tunggu,
        gaji_driver,
        e_toll,
        keterangan_rute,
        tonase,
        status_kas_jalan,  // Added field
        id_kas_jalan
      ],
    });
    return result.affectedRows > 0;
  },

  // Delete Kasjalan
  deleteKasjalan: async (id_kas_jalan) => {
    const [result] = await sequelize.query(`
      DELETE FROM kas_jalan
      WHERE id_kas_jalan = ?
    `, {
      replacements: [id_kas_jalan],
    });
    return result.affectedRows > 0;
  }
};

export default Kasjalan;
