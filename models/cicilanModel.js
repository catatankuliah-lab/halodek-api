import sequelize from "../config/config.js";

const Cicilan = {
  // Mendapatkan semua cicilan dengan join tabel armada
  getAllCicilan: async () => {
    const [results] = await sequelize.query(`
      SELECT
        cicilan.*,
        armada.nopol_armada
      FROM cicilan
      LEFT JOIN
        armada ON cicilan.id_armada = armada.id_armada
    `);
    return results;
  },

  // Mendapatkan cicilan berdasarkan id_cicilan dengan join tabel armada
  getCicilanById: async (id_cicilan) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        cicilan.*,
        armada.nopol_armada
      FROM 
        cicilan
      LEFT JOIN 
        armada ON cicilan.id_armada = armada.id_armada
      WHERE 
        cicilan.id_armada = ?
      `,
      {
        replacements: [id_cicilan],
      }
    );
    console.log(results);
    return results;
  },

  // Menambahkan cicilan baru
  addCicilan: async (cicilanData) => {
    const { id_armada, angsuran, tanggal_angsuran, besaran_angsuran, file_angsuran } = cicilanData;
    console.log(cicilanData);
    const result = await sequelize.query(
      `
      INSERT INTO cicilan (
        id_armada, angsuran, tanggal_angsuran, besaran_angsuran, file_angsuran
      ) VALUES (?, ?, ?, ?, ?)
      `,
      {
        replacements: [
          id_armada,
          angsuran,
          tanggal_angsuran,
          besaran_angsuran,
          file_angsuran
        ],
      }
    );
    return { id_cicilan: result.insertId, ...cicilanData };
    
  },

  // Mengupdate cicilan berdasarkan id_cicilan
  updateCicilan: async (id_cicilan, cicilanData) => {
    const { id_armada, angsuran, tanggal_angsuran, besaran_angsuran, file_angsuran } = cicilanData;
    console.log(cicilanData);
    const [result] = await sequelize.query(
      `
      UPDATE cicilan
      SET 
        id_armada = ?,
        angsuran = ?,
        tanggal_angsuran = ?,
        besaran_angsuran = ?,
        file_angsuran = ?
      WHERE 
        id_cicilan = ?
      `,
      {
        replacements: [
          id_armada,
          angsuran,
          tanggal_angsuran,
          besaran_angsuran,
          file_angsuran,
          id_cicilan
        ],
      }
    );
    return result.affectedRows > 0;
  },
};

export default Cicilan;
