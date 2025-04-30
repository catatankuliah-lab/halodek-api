import Armada from "../models/armadaModel.js"; // Ensure the model is created
import multer from "multer";
const upload = multer();

// Get all Armada
export const getAllArmada = async (req, res) => {
  const { page = 1, limit = 10, nama_jenis_kendaraan, nopol_armada, status_armada } = req.query;

  try {
    const { data, total } = await Armada.getAllArmada(
      parseInt(page),
      parseInt(limit),
      { nama_jenis_kendaraan, nopol_armada, status_armada }
    );

    res.json({
      data,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalData: total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching armadas:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getAllArmadaDetailPage = async (req, res) => {
  const { id_armada } = req.params;
  try {
    const armada = await Armada.getAllArmadaDetailPage(id_armada);
    if (armada) {
      res.status(200).json({
        status: "success",
        data: armada,
        message: "Armada fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Armada not found."
      });
    }
  } catch (error) {
    console.error("Error fetching Armada by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getArmadaById = async (req, res) => {
  const { id_armada } = req.params;
  try {
    const armada = await Armada.getArmadaById(id_armada);
    if (armada) {
      res.status(200).json({
        status: "success",
        data: armada,
        message: "Armada fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Armada not found."
      });
    }
  } catch (error) {
    console.error("Error fetching Armada by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};


export const getAllArmadas = async (req, res) => {
  try {
    const armada = await Armada.getAllArmadas();
    res.status(200).json({
      status: "success",
      data: armada,
      message: "Armadas fetched successfully."
    });
  } catch (error) {
    console.error("Error fetching Armadas:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getArmadaByJenisKendaraan = async (req, res) => {
  const { id_jenis_kendaraan } = req.params;

  try {
    const armadas = await Armada.getArmadaByJenisKendaraan(id_jenis_kendaraan);
    if (armadas.length > 0) {
      res.status(200).json({
        status: "success",
        data: armadas,
        message: "Armada records fetched successfully by Jenis Kendaraan ID."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No Armada records found for the given Jenis Kendaraan ID."
      });
    }
  } catch (error) {
    console.error("Error fetching Armada by Jenis Kendaraan ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Get Armada by Nopol
export const getArmadaByNopol = async (req, res) => {
  const { nopol_armada } = req.params;

  try {
    const armadas = await Armada.getArmadaByNopol(nopol_armada);
    if (armadas.length > 0) {
      res.status(200).json({
        status: "success",
        data: armadas,
        message: "Armada records fetched successfully by Nopol."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No Armada records found for the given Nopol."
      });
    }
  } catch (error) {
    console.error("Error fetching Armada by Nopol:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Add a new Armada
export const addArmada = async (req, res) => {
  const armadaData = req.body;

  try {
    const newArmada = await Armada.addArmada(armadaData);
    res.status(201).json({
      status: "success",
      data: newArmada,
      message: "Armada created successfully."
    });
  } catch (error) {
    console.error("Error creating Armada:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const updateStatusArmada = async (req, res) => {
  const { id_armada } = req.params;
  const armadaData = req.body;
  console.log(armadaData, id_armada);
  try {
    const updatedStatusArmada = await Armada.updateStatusArmada(id_armada, armadaData);
    res.status(200).json({
      status: "success",
      data: updatedStatusArmada,
      message: "Armada updated successfully."
    });
  } catch (error) {
    console.error("Error updating Armada:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};
// Update Armada
export const updateArmada = async (req, res) => {
  const { id_armada } = req.params;
  const armadaData = req.body;

  try {
    const updatedArmada = await Armada.updateArmada(id_armada, armadaData);
    res.status(200).json({
      status: "success",
      data: updatedArmada,
      message: "Armada updated successfully."
    });
  } catch (error) {
    console.error("Error updating Armada:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Delete Armada
export const deleteArmada = async (req, res) => {
  const { id_armada } = req.params;

  try {
    const deleted = await Armada.deleteArmada(id_armada);
    if (deleted) {
      res.status(200).json({
        status: "success",
        message: "Armada deleted successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Armada not found."
      });
    }
  } catch (error) {
    console.error("Error deleting Armada:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getArmadaAvailability = async (req, res) => {
  try {
    const availability = await Armada.getArmadaAvailability();
    res.json({ status: "success", data: availability });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getArmadaRiwayatBulanan = async (req, res) => {
  const { page = 1, limit = 10, bulan, tahun, nopol_armada, status_armada, id_jenis_kendaraan } = req.query;

  try {
    const { data, total } = await Armada.getArmadaRiwayatBulanan(
      parseInt(page),
      parseInt(limit),
      { bulan, tahun, nopol_armada, status_armada, id_jenis_kendaraan }
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