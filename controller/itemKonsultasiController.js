import ItemKonsultasi from "../models/itemKonsultasiModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const upload = multer({
  limits: {
    fieldSize: 10 * 1024 * 1024 // 10 MB, sesuaikan kebutuhan
  }
});

export const createItemKonsultasi = (req, res) => {
  upload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { compressedData, id_konsultasi, dari_id, text } = req.body;

      // Simpan file foto dulu kalau ada
      let fotoPath = null;
      if (req.file) {
        const uploadDir = "uploads/konsultasi/";
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const newFileName = `konsultasi_${Date.now()}.jpg`;
        const filePath = path.join(uploadDir, newFileName);
        fs.writeFileSync(filePath, req.file.buffer);
        fotoPath = filePath;
      }

      // Parse compressedData jika ada
      const compressedObj = compressedData ? JSON.parse(compressedData) : null;

      // Siapkan data yang mau disimpan
      const dataToInsert = {
        id_konsultasi,
        dari_id,
        text,
        hasil: compressedObj ? JSON.stringify(compressedObj) : null,
        foto: fotoPath ? fotoPath : null,
      };

      const hasil = await ItemKonsultasi.createItemKonsultasi(dataToInsert);

      res.status(201).json({
        status: "success",
        message: "Data Item Konsultasi berhasil disimpan",
        data: hasil,
      });
    } catch (error) {
      console.error("Error creating item konsultasi:", error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menyimpan data",
        error: error.message,
      });
    }
  });
};

export const createItemKonsultasiBackup1 = [
  upload.none(),
  async (req, res) => {
    try {
      const { compressedData, id_konsultasi, dari_id, text } = req.body;
      const compressedObj = compressedData ? JSON.parse(compressedData) : null;
      const dataToInsert = {
        id_konsultasi,
        dari_id,
        text,
        foto: compressedObj ? JSON.stringify(compressedObj) : null,
      };
      const hasil = await ItemKonsultasi.createItemKonsultasi(dataToInsert);
      res.json({
        status: "success",
        message: "Data Item Konsultasi berhasil disimpan",
        data: hasil,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menyimpan data",
        error: error.message,
      });
    }
  }
];


export const createItemKonsultasiBackup2 = (req, res) => {
  upload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { id_konsultasi, dari_id, text } = req.body;
    let fotoPath = "";

    try {
      if (req.file) {
        const uploadDir = "uploads/konsultasi/";
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newFileName = `konsultasi_${Date.now()}.jpg`;
        const filePath = path.join(uploadDir, newFileName);
        fs.writeFileSync(filePath, req.file.buffer);
        fotoPath = filePath;
      }

      const hasil = await ItemKonsultasi.createItemKonsultasi({
        id_konsultasi,
        dari_id,
        text,
        foto: fotoPath
      });

      res.status(201).json({
        status: "success",
        data: hasil,
        message: "Item konsultasi berhasil dibuat.",
      });
    } catch (error) {
      console.error("Error creating item konsultasi:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });
};

export const getItemKonsultasiByIdKonsultasi = async (req, res) => {
  const { id_konsultasi } = req.params;
  try {
    const item_konsultasi = await ItemKonsultasi.getItemKonsultasiByIdKonsultasi(id_konsultasi);
    if (item_konsultasi) {
      res.status(200).json({
        status: "success",
        data: item_konsultasi,
        message: "Item Konsultasi fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Item Konsultasi not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching Item Konsultasi by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};