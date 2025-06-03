import sequelize from "../config/config.js";

const Mahasiswa = {

  getMahasiswaFilter: async (page = 1, per_page = 10, filters = {}) => {
    try {
      const offset = (page - 1) * per_page;
      let whereClause = "WHERE mahasiswa.status = 'aktif'";
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.nama) {
        whereClause += " AND users.nama LIKE :nama";
        replacements.nama = `%${filters.nama}%`;
      }

      if (filters.nim) {
        whereClause += " AND mahasiswa.nim LIKE :nim";
        replacements.nim = `%${filters.nim}%`;
      }

      if (filters.fakultas) {
        whereClause += " AND mahasiswa.fakultas LIKE :fakultas";
        replacements.fakultas = `%${filters.fakultas}%`;
      }

      if (filters.jurusan) {
        whereClause += " AND mahasiswa.jurusan LIKE :jurusan";
        replacements.jurusan = `%${filters.jurusan}%`;
      }

      if (filters.angkatan) {
        whereClause += " AND mahasiswa.angkatan LIKE :angkatan";
        replacements.angkatan = `%${filters.angkatan}%`;
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
        mahasiswa.id_mahasiswa,
        mahasiswa.id_pa,
        mahasiswa.nim,
        mahasiswa.fakultas,
        mahasiswa.jurusan,
        mahasiswa.angkatan,
        mahasiswa.status AS "status_mahasiswa",
        mahasiswa.foto_mahasiswa
      FROM
        mahasiswa
      LEFT JOIN
        users ON mahasiswa.id_user = users.id_user
      ${whereClause}
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM mahasiswa
      LEFT JOIN
        users
      ON
        mahasiswa.id_user = users.id_user
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

  getMahasiswaByIdMahasiswa: async (id_mahasiswa) => {
    const [results] = await sequelize.query(
      `
        SELECT
          mahasiswa.id_mahasiswa,
          mahasiswa.id_user,
          mahasiswa.id_pa,
          mahasiswa.nim,
          mahasiswa.fakultas,
          mahasiswa.jurusan,
          mahasiswa.angkatan,
          mahasiswa.foto_mahasiswa,
          mahasiswa.status AS status_mahasiswa,
          users.nama,
          users.email,
          users.password,
          users.no_hp,
          users.role,
          users.status AS status_user,
          pa_user.nama AS nama_pa,
          orangtua_user.nama AS nama_orangtua
        FROM mahasiswa
        LEFT JOIN users ON mahasiswa.id_user = users.id_user
        LEFT JOIN pembimbing_akademik ON mahasiswa.id_pa = pembimbing_akademik.id_pa
        LEFT JOIN users AS pa_user ON pembimbing_akademik.id_user = pa_user.id_user
        LEFT JOIN orangtua_mahasiswa ON mahasiswa.id_mahasiswa = orangtua_mahasiswa.id_mahasiswa
        LEFT JOIN users AS orangtua_user ON orangtua_mahasiswa.id_user = orangtua_user.id_user
        WHERE mahasiswa.id_mahasiswa = ?
      `,
      {
        replacements: [id_mahasiswa],
      }
    );
    return results[0];
  },

  getMahasiswaByIdUser: async (id_user) => {
    const [results] = await sequelize.query(
      `
        SELECT
          mahasiswa.id_mahasiswa,
          mahasiswa.id_user,
          mahasiswa.id_pa,
          mahasiswa.nim,
          mahasiswa.fakultas,
          mahasiswa.jurusan,
          mahasiswa.angkatan,
          mahasiswa.foto_mahasiswa,
          mahasiswa.status AS status_mahasiswa,
          users.nama AS nama_mahasiswa,
          users.email,
          users.password,
          users.no_hp,
          users.role,
          users.status AS status_user,
          pa_user.nama AS nama_pa,
          orangtua_user.nama AS nama_orangtua
        FROM mahasiswa
        LEFT JOIN users ON mahasiswa.id_user = users.id_user
        LEFT JOIN pembimbing_akademik ON mahasiswa.id_pa = pembimbing_akademik.id_pa
        LEFT JOIN users AS pa_user ON pembimbing_akademik.id_user = pa_user.id_user
        LEFT JOIN orangtua_mahasiswa ON mahasiswa.id_mahasiswa = orangtua_mahasiswa.id_mahasiswa
        LEFT JOIN users AS orangtua_user ON orangtua_mahasiswa.id_user = orangtua_user.id_user
        WHERE users.id_user = ?
      `,
      {
        replacements: [id_user],
      }
    );
    return results[0];
  },

  updateMahasiswaByIdMahasiswa: async (id_mahasiswa, userData) => {
    if (!id_mahasiswa || typeof userData !== 'object') return false;

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return false;

    const query = `
    UPDATE mahasiswa
    SET ${fields.join(', ')}
    WHERE id_mahasiswa = ?
  `;

    values.push(id_mahasiswa);

    const [result] = await sequelize.query(query, { replacements: values });

    return result.affectedRows > 0;
  },

};

export default Mahasiswa;
