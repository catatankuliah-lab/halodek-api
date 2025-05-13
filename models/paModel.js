import sequelize from "../config/config.js";

const PA = {
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
