import KabupatenKota from "../models/kabupatenkotaModel.js";

export const getAllKabupatenKota = async (req, res) => {
  try {
    const kabupatenKota = await KabupatenKota.getAllKabupatenKota();
    res.status(200).json({
      status: "success",
      data: kabupatenKota,
      message: "Kabupaten/Kota fetched successfully."
    });
  } catch (error) {
    console.error("Error fetching kabupaten/kota:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getKabupatenKotaById = async (req, res) => {
  const { id_kabupaten_kota } = req.params;
  try {
    const kabupatenKota = await KabupatenKota.getKabupatenKotaById(id_kabupaten_kota);
    if (kabupatenKota) {
      res.status(200).json({
        status: "success",
        data: kabupatenKota,
        message: "Kabupaten/Kota fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Kabupaten/Kota not found."
      });
    }
  } catch (error) {
    console.error("Error fetching kabupaten/kota by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const createKabupatenKota = async (req, res) => {
  const { kode_kabupaten_kota, nama_kabupaten_kota } = req.body;
  try {
    await KabupatenKota.addKabupatenKota(kode_kabupaten_kota, nama_kabupaten_kota);
    res.status(201).json({
      status: "success",
      data: { kode_kabupaten_kota, nama_kabupaten_kota },
      message: "Kabupaten/Kota created successfully."
    });
  } catch (error) {
    console.error("Error creating kabupaten/kota:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const updateKabupatenKota = async (req, res) => {
  const { id_kabupaten_kota } = req.params;
  const kabupatenKotaData = req.body;
  try {
    const updated = await KabupatenKota.updateKabupatenKota(id_kabupaten_kota, kabupatenKotaData);
    if (updated) {
      res.status(200).json({
        status: "success",
        message: "Kabupaten/Kota updated successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Kabupaten/Kota not found."
      });
    }
  } catch (error) {
    console.error("Error updating kabupaten/kota:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};