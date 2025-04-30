import PO from "../models/poModel.js"; // Ensure the model is created
import multer from "multer";
import path from "path";
import fs from "fs";
const upload = multer();

// Get all PO
export const getAllPO = async (req, res) => {
  const { page = 1, limit = 10, nomor_po, customer, nopol_armada, nama_driver, startDate, endDate, status_po } = req.query;

  try {
    const { data, total } = await PO.getAllPO(
      parseInt(page),
      parseInt(limit),
      { nomor_po, customer, nopol_armada, nama_driver, startDate, endDate, status_po }
    );

    res.json({
      data,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalData: total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Jumlah PO by Bulan
export const getJumlahPOBulanan = async (req, res) => {
  try {
    const { bulan } = req.params;

    // Validasi bulan (1-12)
    if (!bulan || isNaN(bulan) || bulan < 1 || bulan > 12) {
      return res.status(400).json({ message: "Bulan tidak valid" });
    }

    // Ambil jumlah PO berdasarkan LIKE
    const jumlahPO = await PO.getJumlahPOBulanan(bulan);

    return res.status(200).json({ bulan, jumlahPO });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get PO by ID
export const getPOById = async (req, res) => {
  const { id_po } = req.params;

  try {
    const po = await PO.getPOById(id_po);
    if (po) {
      res.status(200).json({
        status: "success",
        data: po,
        message: "PO fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "PO not found."
      });
    }
  } catch (error) {
    console.error("Error fetching PO by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Get PO by Customer ID
export const getPOByCustomerId = async (req, res) => {
  const { id_customer } = req.params;

  try {
    const pos = await PO.getPOByCustomerId(id_customer);
    if (pos.length > 0) {
      res.status(200).json({
        status: "success",
        data: pos,
        message: "PO records fetched successfully by Customer ID."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No PO records found for the given Customer ID."
      });
    }
  } catch (error) {
    console.error("Error fetching PO by Customer ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Get PO by Armada ID
export const getPOByArmadaId = async (req, res) => {
  const { id_armada } = req.params;

  try {
    const pos = await PO.getPOByArmadaId(id_armada);
    if (pos.length > 0) {
      res.status(200).json({
        status: "success",
        data: pos,
        message: "PO records fetched successfully by Armada ID."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No PO records found for the given Armada ID."
      });
    }
  } catch (error) {
    console.error("Error fetching PO by Armada ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Get PO by Driver ID
export const getPOByDriverId = async (req, res) => {
  const { page = 1, limit = 10, id_user, nomor_po, customer, nopol_armada, nama_driver, startDate, endDate, status_po } = req.query;
  try {
    const { data, total } = await PO.getPOByDriverId(
      parseInt(page),
      parseInt(limit),
      parseInt(id_user),
      { nomor_po, customer, nopol_armada, nama_driver, startDate, endDate, status_po }
    );

    res.json({
      data,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalData: total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new PO
export const addPO = async (req, res) => {
  const { nomor_po, tanggal_po, jam_pemesanan_po, jam_muat, id_customer, id_armada, id_driver, destination, status_po, origin, jenis_muatan, catatan_po, } = req.body;
  try {
    const id_po = await PO.addPO(nomor_po, tanggal_po, jam_pemesanan_po, jam_muat, id_customer, id_armada, id_driver, destination, status_po, origin, jenis_muatan, catatan_po,);
    console.log(id_po);
    res.status(201).json({
      status: "success",
      data: { id_po },
      message: "PO created successfully."
    });
  } catch (error) {
    console.error("Error creating PO:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Update PO
export const updatePO = async (req, res) => {
  const { id_po } = req.params;
  const poData = req.body;
  try {
    const updatedPO = await PO.updatePO(id_po, poData);
    res.status(200).json({
      status: "success",
      data: updatedPO,
      message: "PO updated successfully."
    });
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Update Status PO
export const updateStatusPO = async (req, res) => {
  const { id_po } = req.params;
  const poData = req.body;
  console.log(poData, id_po);
  try {
    const updatedPO = await PO.updateStatusPO(id_po, poData);
    res.status(200).json({
      status: "success",
      data: updatedPO,
      message: "PO updated successfully."
    });
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const updateTBPO = async (req, res) => {
  const { id_po } = req.params;
  const poData = req.body;
  console.log(poData, id_po);
  try {
    const updatedPO = await PO.updateTBPO(id_po, poData);
    res.status(200).json({
      status: "success",
      data: updatedPO,
      message: "PO updated successfully."
    });
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Delete PO
export const deletePO = async (req, res) => {
  const { id_po } = req.params;

  try {
    const deleted = await PO.deletePO(id_po);
    if (deleted) {
      res.status(200).json({
        status: "success",
        message: "PO deleted successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "PO not found."
      });
    }
  } catch (error) {
    console.error("Error deleting PO:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const uploadSJ = async (req, res) => {
  const { id_po } = req.params;
  upload.single("file_sj")(req, res, async (err) => {

    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File tidak ditemukan" });
    }

    const nomorPO = req.body.nomor_po;
    const tanggalPO = req.body.tanggal_po;
    if (!nomorPO) {
      return res.status(400).json({ error: "Nomor PO tidak ditemukan" });
    }

    // Tentukan lokasi penyimpanan
    const uploadPath = "uploads/po/" + tanggalPO + "/" + nomorPO + "/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Tentukan nama file baru
    const newFileName = `sj.jpg`;
    const filePath = path.join(uploadPath, newFileName);

    // Simpan file dari buffer ke disk dengan nama yang diinginkan
    fs.writeFile(filePath, req.file.buffer, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Gagal menyimpan file" });
      }
      try {
        // Update database dengan nama file baru
        const fileFoto = uploadPath + "" + newFileName;
        const updateSJ = await PO.uploadSJ(id_po, fileFoto);
        res.status(200).json({
          status: "success",
          data: updateSJ,
          message: "SJ updated successfully.",
        });
      } catch (error) {
        console.error("Error updating LO:", error);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      }
    });
  });
};
