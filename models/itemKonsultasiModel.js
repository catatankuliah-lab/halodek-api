import sequelize from "../config/config.js";

const ItemKonsultasi = {

  createItemKonsultasi: async (data) => {
    console.log('fields:', Object.keys(data));
    console.log('values:', Object.values(data));

    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `
    INSERT INTO item_konsultasi (${fields.join(', ')})
    VALUES (${placeholders})
  `;

    console.log('Query:', query);
    console.log('Replacements:', values);

    const result = await sequelize.query(query, {
      replacements: values,
    });

    return result[0];
  },

  getItemKonsultasiByIdKonsultasi: async (id_konsultasi) => {
    const [results] = await sequelize.query(
      `
        SELECT
          item_konsultasi.*,
          konsultasi.id_konsultasi,
          konsultasi.kepada_id
        FROM
          item_konsultasi
        JOIN
          konsultasi ON item_konsultasi.id_konsultasi = konsultasi.id_konsultasi
        WHERE
          item_konsultasi.id_konsultasi = ?
      `,
      {
        replacements: [id_konsultasi],
      }
    );
    return results;
  },

};

export default ItemKonsultasi;
