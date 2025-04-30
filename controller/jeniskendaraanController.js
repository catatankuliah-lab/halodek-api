import JenisKendaraan from "../models/jeniskendaraanModel.js";

export const getAllJenisKendaraan = async (req, res) => {
  try {
    const jenisKendaraan = await JenisKendaraan.getAllJenisKendaraan();
    res.status(200).json({
      status: "success",
      data: jenisKendaraan,
      message: "Jenis kendaraan fetched successfully."
    });
  } catch (error) {
    console.error("Error fetching jenis kendaraan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getJenisKendaraanById = async (req, res) => {
  const { id_jenis_kendaraan } = req.params;
  try {
    const jenisKendaraan = await JenisKendaraan.getJenisKendaraanById(id_jenis_kendaraan);
    if (jenisKendaraan) {
      res.status(200).json({
        status: "success",
        data: jenisKendaraan,
        message: "Jenis kendaraan fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Jenis kendaraan not found."
      });
    }
  } catch (error) {
    console.error("Error fetching jenis kendaraan by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};
