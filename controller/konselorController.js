import Konselor from "../models/konselorModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const upload = multer();

export const getKonselorFilter = async (req, res) => {
  const { page = 1, limit = 10, nama, no_hp, status } = req.query;
  try {
    const { data, total } = await Konselor.getKonselorFilter(
      parseInt(page),
      parseInt(limit),
      { nama, no_hp, status }
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

export const createKonselor = async (req, res) => {
  upload.single("foto_konselor")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { id_user, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File tidak ditemukan" });
    }

    try {
      const uploadPath = "uploads/konselor/";
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const newFileName = `konselor_${Date.now()}.jpg`;
      const filePath = path.join(uploadPath, newFileName);

      fs.writeFileSync(filePath, req.file.buffer);

      const konslor = await Konselor.addKonselor(id_user, status, filePath);

      res.status(201).json({
        status: "success",
        data: konslor,
        message: "Konselor created successfully.",
      });
    } catch (error) {
      console.error("Error creating Konselor:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });
};

export const getKonselorByIdKonselor = async (req, res) => {
  const { id_konselor } = req.params;
  try {
    const konselor = await Konselor.getKonselorByIdKonselor(id_konselor);
    if (konselor) {
      res.status(200).json({
        status: "success",
        data: konselor,
        message: "Konselor fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Konselor not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching Konselor by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getKonselorByIdUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const konselor = await Konselor.getKonselorByIdUser(id_user);
    if (konselor) {
      res.status(200).json({
        status: "success",
        data: konselor,
        message: "Konselor fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Konselor not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching Konselor by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateKonselorByIdKonselor = async (req, res) => {
  upload.single("foto_konselor")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const { id_konselor } = req.params;
    const { status } = req.body;

    try {
      const existing = await Konselor.getKonselorByIdKonselor(id_konselor);

      if (!existing) {
        return res.status(404).json({ error: "Konselor tidak ditemukan" });
      }

      let fotoPath = existing.foto_konselor;

      if (req.file) {
        const uploadPath = "uploads/konselor/";
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        if (fotoPath && fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
        }
        const newFileName = `konselor_${Date.now()}.jpg`;
        const newFilePath = path.join(uploadPath, newFileName);
        fs.writeFileSync(newFilePath, req.file.buffer);
        fotoPath = newFilePath;
      }

      const updated = await Konselor.updateKonselorByIdKonselor(id_konselor, {
        status,
        foto_konselor: fotoPath
      });

      res.status(200).json({
        status: "success",
        data: updated,
        message: "Konselor updated successfully.",
      });
    } catch (error) {
      console.error("Error updating Konselor:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });
};