import sequelize from "../config/config.js";

const PO = {
  getAllPO: async (page = 1, per_page = 10, filters = {}) => {
    try {
      const offset = (page - 1) * per_page;
      let whereClause = "WHERE 1=1";
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset) };

      if (filters.nomor_po) {
        whereClause += " AND po.nomor_po LIKE :nomor_po";
        replacements.nomor_po = `%${filters.nomor_po}%`;
      }

      if (filters.customer) {
        whereClause += " AND customer.nama_customer LIKE :customer";
        replacements.customer = `%${filters.customer}%`;
      }

      if (filters.nopol_armada) {
        whereClause += " AND armada.nopol_armada LIKE :nopol_armada";
        replacements.nopol_armada = `%${filters.nopol_armada}%`;
      }

      if (filters.nama_driver) {
        whereClause += " AND driver.nama_driver LIKE :nama_driver";
        replacements.nama_driver = `%${filters.nama_driver}%`;
      }

      if (filters.startDate && filters.endDate) {
        whereClause += " AND po.tanggal_po BETWEEN :startDate AND :endDate";
        replacements.startDate = filters.startDate;
        replacements.endDate = filters.endDate;
      } else if (filters.startDate) {
        whereClause += " AND po.tanggal_po >= :startDate";
        replacements.startDate = filters.startDate;
      } else if (filters.endDate) {
        whereClause += " AND po.tanggal_po <= :endDate";
        replacements.endDate = filters.endDate;
      }

      if (filters.status_po) {
        whereClause += " AND po.status_po = :status_po";
        replacements.status_po = filters.status_po;
      }

      const query = `
      SELECT
        po.id_po,
        po.nomor_po,
        po.tanggal_po,
        po.jam_pemesanan_po,
        po.jam_muat,
        po.id_customer,
        po.id_armada,
        po.id_driver,
        po.destination,
        po.status_po,
        po.origin,
        po.jenis_muatan,
        customer.nama_customer,
        customer.alamat_customer,
        driver.nama_driver,
        armada.nopol_armada,
        jenis_kendaraan.nama_jenis_kendaraan
      FROM po
      LEFT JOIN customer ON po.id_customer = customer.id_customer
      LEFT JOIN driver ON po.id_driver = driver.id_driver
      LEFT JOIN armada ON po.id_armada = armada.id_armada
      LEFT JOIN jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      ${whereClause}
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM po
      LEFT JOIN customer ON po.id_customer = customer.id_customer
      LEFT JOIN driver ON po.id_driver = driver.id_driver
      LEFT JOIN armada ON po.id_armada = armada.id_armada
      LEFT JOIN jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
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

  // Mendapatkan Jumlah PO berdasarkan Bulan
  getJumlahPOBulanan: async (bulan) => {
    try {
      const tahunSekarang = new Date().getFullYear(); // Ambil tahun sekarang
      const bulanFormatted = bulan.toString().padStart(2, "0"); // Format jadi '01', '02', dst.

      const [results] = await sequelize.query(
        `
        SELECT COUNT(*) as jumlahPO
        FROM po
        WHERE tanggal_po LIKE ?
      `,
        { replacements: [`${tahunSekarang}-${bulanFormatted}%`] }
      );

      return results[0].jumlahPO || 0;
    } catch (error) {
      console.error("Error in getJumlahPOBulanan:", error);
      throw new Error("Gagal mengambil jumlah PO bulanan");
    }
  },

  // Mendapatkan PO berdasarkan ID
  getPOById: async (id_po) => {
    const [results] = await sequelize.query(
      `
      SELECT
        po.id_po,
        po.nomor_po,
        po.tanggal_po,
        po.jam_pemesanan_po,
        po.jam_muat,
        po.id_customer,
        po.id_armada,
        po.id_driver,
        po.destination,
        po.status_po,
        po.origin,
        po.jenis_muatan,
        po.catatan_po,
        po.file_sj,
        customer.nama_customer,
        customer.alamat_customer,
        driver.nama_driver,
        armada.nopol_armada,
        jenis_kendaraan.id_jenis_kendaraan,
        jenis_kendaraan.nama_jenis_kendaraan,
        jenis_kendaraan.rasio_perkalian,
        jenis_kendaraan.rasio_perkalian_kosong,
        COALESCE(
          JSON_OBJECT(
            'REGULER', (
              SELECT JSON_OBJECT(
                'id_kas_jalan', kas_jalan.id_kas_jalan,
                'jenis_kas_jalan', kas_jalan.jenis_kas_jalan,
                'jarak_isi', kas_jalan.jarak_isi,
                'jarak_kosong', kas_jalan.jarak_kosong,
                'jam_tunggu', kas_jalan.jam_tunggu,
                'gaji_driver', kas_jalan.gaji_driver,
                'e_toll', kas_jalan.e_toll,
                'keterangan_rute', kas_jalan.keterangan_rute,
                'tonase', kas_jalan.tonase
              )
              FROM kas_jalan
              WHERE kas_jalan.id_po = po.id_po AND kas_jalan.jenis_kas_jalan = 'REGULER'
              LIMIT 1
            ),
            'KOSONGAN', (
              SELECT JSON_OBJECT(
                'id_kas_jalan', kas_jalan.id_kas_jalan,
                'jenis_kas_jalan', kas_jalan.jenis_kas_jalan,
                'jarak_isi', kas_jalan.jarak_isi,
                'jarak_kosong', kas_jalan.jarak_kosong,
                'jam_tunggu', kas_jalan.jam_tunggu,
                'gaji_driver', kas_jalan.gaji_driver,
                'e_toll', kas_jalan.e_toll,
                'keterangan_rute', kas_jalan.keterangan_rute,
                'tonase', kas_jalan.tonase
              )
              FROM kas_jalan
              WHERE kas_jalan.id_po = po.id_po AND kas_jalan.jenis_kas_jalan = 'KOSONGAN'
              LIMIT 1
            )
          ), '{}'
        ) AS kas_jalan,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_titik_bongkar', titik_bongkar.id_titik_bongkar,
              'id_kabupaten_kota', titik_bongkar.id_kabupaten_kota,
              'nama_kabupaten_kota', kabupaten_kota.nama_kabupaten_kota,
              'alamat_titik_bongkar', titik_bongkar.alamat_titik_bongkar,
              'jam_bongkar', titik_bongkar.jam_bongkar
            )
          ), '[]'
        ) AS titik_bongkar
      FROM po
      LEFT JOIN customer ON po.id_customer = customer.id_customer
      LEFT JOIN driver ON po.id_driver = driver.id_driver
      LEFT JOIN armada ON po.id_armada = armada.id_armada
      LEFT JOIN jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      LEFT JOIN titik_bongkar ON po.id_po = titik_bongkar.id_po
      LEFT JOIN kabupaten_kota ON titik_bongkar.id_kabupaten_kota = kabupaten_kota.id_kabupaten_kota
      WHERE po.id_po = ?
      GROUP BY po.id_po;
    `,
      { replacements: [id_po] }
    );
    return results[0];
  },

  // Mendapatkan PO berdasarkan ID Customer
  getPOByCustomerId: async (id_customer) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_po,
        tanggal_po,
        jam_pemesanan_po,
        jam_muat,
        id_customer,
        id_armada,
        id_driver,
        status_po
      FROM po
      WHERE id_customer = ?
    `,
      { replacements: [id_customer] }
    );
    return results;
  },

  // Mendapatkan PO berdasarkan ID Armada
  getPOByArmadaId: async (id_armada) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_po,
        tanggal_po,
        jam_pemesanan_po,
        jam_muat,
        id_customer,
        id_armada,
        id_driver,
        status_po
      FROM po
      WHERE id_armada = ?
    `,
      { replacements: [id_armada] }
    );
    return results;
  },

  // Mendapatkan PO berdasarkan ID Driver
  getPOByDriverId: async (page = 1, per_page = 10, id_user, filters = {}) => {
    console.log("model" + id_user);
    try {
      const offset = (page - 1) * per_page;
      let replacements = { per_page: parseInt(per_page), offset: parseInt(offset), id_user };
      let whereClause = "WHERE driver.id_user = :id_user";

      if (filters.nomor_po) {
        whereClause += " AND po.nomor_po LIKE :nomor_po";
        replacements.nomor_po = `%${filters.nomor_po}%`;
      }

      if (filters.customer) {
        whereClause += " AND customer.nama_customer LIKE :customer";
        replacements.customer = `%${filters.customer}%`;
      }

      if (filters.nopol_armada) {
        whereClause += " AND armada.nopol_armada LIKE :nopol_armada";
        replacements.nopol_armada = `%${filters.nopol_armada}%`;
      }

      if (filters.nama_driver) {
        whereClause += " AND driver.nama_driver LIKE :nama_driver";
        replacements.nama_driver = `%${filters.nama_driver}%`;
      }

      if (filters.startDate && filters.endDate) {
        whereClause += " AND po.tanggal_po BETWEEN :startDate AND :endDate";
        replacements.startDate = filters.startDate;
        replacements.endDate = filters.endDate;
      } else if (filters.startDate) {
        whereClause += " AND po.tanggal_po >= :startDate";
        replacements.startDate = filters.startDate;
      } else if (filters.endDate) {
        whereClause += " AND po.tanggal_po <= :endDate";
        replacements.endDate = filters.endDate;
      }

      if (filters.status_po) {
        whereClause += " AND po.status_po = :status_po";
        replacements.status_po = filters.status_po;
      }

      const query = `
      SELECT
        po.id_po,
        po.nomor_po,
        po.tanggal_po,
        po.jam_pemesanan_po,
        po.jam_muat,
        po.id_customer,
        po.id_armada,
        po.id_driver,
        po.destination,
        po.status_po,
        customer.nama_customer,
        customer.alamat_customer,
        driver.nama_driver,
        armada.nopol_armada,
        jenis_kendaraan.nama_jenis_kendaraan
      FROM po
      LEFT JOIN customer ON po.id_customer = customer.id_customer
      LEFT JOIN driver ON po.id_driver = driver.id_driver
      LEFT JOIN armada ON po.id_armada = armada.id_armada
      LEFT JOIN jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      ${whereClause}
      LIMIT :per_page OFFSET :offset;
    `;

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
      SELECT COUNT(*) AS total FROM po
      LEFT JOIN customer ON po.id_customer = customer.id_customer
      LEFT JOIN driver ON po.id_driver = driver.id_driver
      LEFT JOIN armada ON po.id_armada = armada.id_armada
      LEFT JOIN jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
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

  // Menambahkan PO baru
  addPO: async (nomor_po, tanggal_po, jam_pemesanan_po, jam_muat, id_customer, id_armada, id_driver, destination, status_po, origin, jenis_muatan, catatan_po) => {
    const result = await sequelize.query(
      `
      INSERT INTO po (nomor_po,tanggal_po,jam_pemesanan_po,jam_muat,id_customer,id_armada,id_driver,destination,status_po,origin,jenis_muatan,catatan_po)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      {
        replacements: [nomor_po, tanggal_po, jam_pemesanan_po, jam_muat, id_customer, id_armada, id_driver, destination, status_po, origin, jenis_muatan, catatan_po],
      }
    );
    return result[0];
  },

  // Memperbarui PO
  updatePO: async (id_po, poData) => {
    const { nomor_po, tanggal_po, jam_pemesanan_po, jam_muat, id_customer, id_armada, id_driver, status_po, origin, catatan_po, jenis_muatan, destination } = poData;
    const [result] = await sequelize.query(
      `
      UPDATE po
      SET nomor_po = ?, tanggal_po = ?, jam_pemesanan_po = ?, jam_muat = ?, id_customer = ?, id_armada = ?, id_driver = ?, status_po = ?, origin = ?, catatan_po = ?, jenis_muatan = ?, destination = ?
      WHERE id_po = ?
    `,
      {
        replacements: [nomor_po, tanggal_po, jam_pemesanan_po, jam_muat, id_customer, id_armada, id_driver, status_po, origin, catatan_po, jenis_muatan, destination, id_po],
      }
    );
    return result.affectedRows > 0;
  },

  // Memperbarui Status PO
  updateStatusPO: async (id_po, poData) => {
    const { status_po } = poData;
    const [result] = await sequelize.query(
      `
      UPDATE po
      SET status_po = ?
      WHERE id_po = ?
    `,
      {
        replacements: [status_po, id_po],
      }
    );
    return result.affectedRows > 0;
  },

  // Memperbarui TB PO
  updateTBPO: async (id_po, poData) => {
    const { titik_bongkar } = poData;
    const [result] = await sequelize.query(
      `
      UPDATE po
      SET titik_bongkar = ?
      WHERE id_po = ?
    `,
      {
        replacements: [titik_bongkar, id_po],
      }
    );
    return result.affectedRows > 0;
  },

  // Menghapus PO
  deletePO: async (id_po) => {
    const [result] = await sequelize.query(
      `DELETE FROM po WHERE id_po = ?`,
      { replacements: [id_po] }
    );
    return result.affectedRows > 0;
  },

  uploadSJ: async (id_po, FileFoto) => {
    const [result] = await sequelize.query(
      `
      UPDATE po
      SET file_sj = ?
      WHERE id_po = ?
    `,
      {
        replacements: [FileFoto, id_po],
      }
    );
    return result.affectedRows > 0;
  }
};

export default PO;
