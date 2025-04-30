import Driver from "../models/driverModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id_driver = req.params.id_driver;
    const uploadPath = path.join('./uploads', 'driver');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    req.uploadPath = uploadPath;

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // Mendapatkan tahun (e.g., 2024)
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Mendapatkan bulan (e.g., 12)
    let date = String(currentDate.getDate()).padStart(2, '0'); // Mendapatkan tanggal (e.g., 23)

    // Menggabungkan menjadi format tahunbulantanggal
    let formattedDate = `${year}${month}${date}`;

    const uniqueSuffix = Date.now().toString().slice(-8);

    cb(null, `${formattedDate}_${uniqueSuffix}_DTT88LOG013273011001.pdf`);
  },
});


const upload = multer({ storage });

// Get all drivers
export const getAllDriver = async (req, res) => {
  const { page = 1, limit = 10, nik, nama_driver, status_driver } = req.query;

  try {
    const { data, total } = await Driver.getAllDriver(
      parseInt(page),
      parseInt(limit),
      { nik, nama_driver, status_driver }
    );

    res.json({
      data,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalData: total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const driver = await Driver.getAllDrivers();
    res.status(200).json({
      status: "success",
      data: driver,
      message: "Drivers fetched successfully."
    });
  } catch (error) {
    console.error("Error fetching Drivers:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getAllDriverDetailPage = async (req, res) => {
  const { id_driver } = req.params;

  try {
    const driver = await Driver.getAllDriverDetailPage(id_driver);
    if (driver) {
      res.status(200).json({
        status: "success",
        data: driver,
        message: "Driver fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Driver not found."
      });
    }
  } catch (error) {
    console.error("Error fetching driver by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getDriverById = async (req, res) => {
  const { id_driver } = req.params;

  try {
    const driver = await Driver.getDriverById(id_driver);
    if (driver) {
      res.status(200).json({
        status: "success",
        data: driver,
        message: "Driver fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Driver not found."
      });
    }
  } catch (error) {
    console.error("Error fetching driver by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Add a new driver
export const addDriver = async (req, res) => {
  const driverData = req.body;

  try {
    const newDriver = await Driver.addDriver(driverData);
    res.status(201).json({
      status: "success",
      data: newDriver,
      message: "Driver created successfully."
    });
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Update Status Driver
export const updateStatusDriver = async (req, res) => {
  const { id_driver } = req.params;
  const driverData = req.body;
  console.log(driverData, id_driver);
  try {
    const updatedStatusDriver = await Driver.updateStatusDriver(id_driver, driverData);
    res.status(200).json({
      status: "success",
      data: updatedStatusDriver,
      message: "Driver updated successfully."
    });
  } catch (error) {
    console.error("Error updating Driver:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};
// Update driver
export const updateDriver = async (req, res) => {
  const { id_driver } = req.params;
  const driverData = req.body;

  try {
    const updatedDriver = await Driver.updateDriver(id_driver, driverData);
    res.status(200).json({
      status: "success",
      data: updatedDriver,
      message: "Driver updated successfully."
    });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Delete driver
export const deleteDriver = async (req, res) => {
  const { id_driver } = req.params;

  try {
    const deleted = await Driver.deleteDriver(id_driver);
    if (deleted) {
      res.status(200).json({
        status: "success",
        message: "Driver deleted successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Driver not found."
      });
    }
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// driverController.js

// Fungsi untuk mendapatkan ketersediaan driver
export const getDriverAvailability = async (req, res) => {
  try {
    const availability = await Driver.getDriverAvailability();
    res.json({ status: "success", data: availability });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const uploadFileDriver = async (req, res) => {
  const { id_driver } = req.params;
  const file_driver = req.file.filename;

  try {
    const result = await Driver.uploadFileDriver(id_driver, {
      file_driver
    });
    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        message: "Driver updated successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Driver not found for the given ID.",
      });
    }
  } catch (error) {
    console.error("Error updating Driver:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
export { upload };