import Mahasiswa from "../models/mahasiswaModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const upload = multer();

export const getMahasiswaFilter = async (req, res) => {
  const { page = 1, limit = 10, nama, nim, fakultas, jurusan, angkatan } = req.query;
  try {
    const { data, total } = await Mahasiswa.getMahasiswaFilter(
      parseInt(page),
      parseInt(limit),
      { nama, nim, fakultas, jurusan, angkatan }
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

export const getMahasiswaByIdMahasiswa = async (req, res) => {
  const { id_mahasiswa } = req.params;
  console.log("ID MAHASISWANYA", id_mahasiswa);
  try {
    const mahasiswa = await Mahasiswa.getMahasiswaByIdMahasiswa(id_mahasiswa);
    if (mahasiswa) {
      res.status(200).json({
        status: "success",
        data: mahasiswa,
        message: "mahasiswa fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "mahasiswa not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching mahasiswa by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getMahasiswaByIdUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const mahasiswa = await Mahasiswa.getMahasiswaByIdUser(id_user);
    if (mahasiswa) {
      res.status(200).json({
        status: "success",
        data: mahasiswa,
        message: "mahasiswa fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "mahasiswa not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching mahasiswa by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateMahasiswaByIdMahasiswa = async (req, res) => {
  upload.single("foto_mahasiswa")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const { id_mahasiswa } = req.params;
    const { status } = req.body;

    try {
      const existing = await Mahasiswa.getMahasiswaByIdMahasiswa(id_mahasiswa);

      if (!existing) {
        return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
      }

      let fotoPath = existing.foto_mahasiswa;

      if (req.file) {
        const uploadPath = "uploads/mahasiswa/";
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        if (fotoPath && fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
        }
        const newFileName = `mahasiswa_${Date.now()}.jpg`;
        const newFilePath = path.join(uploadPath, newFileName);
        fs.writeFileSync(newFilePath, req.file.buffer);
        fotoPath = newFilePath;
      }

      const updated = await Mahasiswa.updateMahasiswaByIdMahasiswa(id_mahasiswa, {
        foto_mahasiswa: fotoPath
      });

      res.status(200).json({
        status: "success",
        data: updated,
        message: "Mahasiswa updated successfully.",
      });
    } catch (error) {
      console.error("Error updating Mahasiswa:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });
};