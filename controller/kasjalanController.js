import Kasjalan from "../models/kasjalanModel.js"; // Make sure the model is created

// Get all Kasjalan
export const getAllKasjalan = async (req, res) => {
  try {
    const kasjalans = await Kasjalan.getAllKasjalan();
    res.status(200).json({
      status: "success",
      data: kasjalans,
      message: "Kasjalans fetched successfully."
    });
  } catch (error) {
    console.error("Error fetching Kasjalan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Get Kasjalan by ID
export const getKasjalanById = async (req, res) => {
  const { id_kas_jalan } = req.params;

  try {
    const kasjalan = await Kasjalan.getKasjalanById(id_kas_jalan);
    if (kasjalan) {
      res.status(200).json({
        status: "success",
        data: kasjalan,
        message: "Kasjalan fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Kasjalan not found."
      });
    }
  } catch (error) {
    console.error("Error fetching Kasjalan by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Get Kasjalan by PO ID
export const getKasjalanByIdPO = async (req, res) => {
  const { id_po } = req.params;

  try {
    const kasjalans = await Kasjalan.getKasjalanByIdPO(id_po);
    if (kasjalans.length > 0) {
      res.status(200).json({
        status: "success",
        data: kasjalans,
        message: "Kasjalans fetched successfully by PO ID."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No Kasjalans found for the given PO ID."
      });
    }
  } catch (error) {
    console.error("Error fetching Kasjalan by PO ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Add a new Kasjalan
export const addKasjalan = async (req, res) => {
  const kasjalanData = req.body;

  try {
    // Include 'status_kas_jalan' field in the data
    const newKasjalan = await Kasjalan.addKasjalan(kasjalanData);
    res.status(201).json({
      status: "success",
      data: newKasjalan,
      message: "Kasjalan created successfully."
    });
  } catch (error) {
    console.error("Error creating Kasjalan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Update Kasjalan
export const updateKasjalan = async (req, res) => {
  const { id_kas_jalan } = req.params;
  const kasjalanData = req.body;

  try {
    // Include 'status_kas_jalan' field in the update process
    const updatedKasjalan = await Kasjalan.updateKasjalan(id_kas_jalan, kasjalanData);
    res.status(200).json({
      status: "success",
      data: updatedKasjalan,
      message: "Kasjalan updated successfully."
    });
  } catch (error) {
    console.error("Error updating Kasjalan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

// Delete Kasjalan
export const deleteKasjalan = async (req, res) => {
  const { id_kas_jalan } = req.params;

  try {
    const deleted = await Kasjalan.deleteKasjalan(id_kas_jalan);
    if (deleted) {
      res.status(200).json({
        status: "success",
        message: "Kasjalan deleted successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Kasjalan not found."
      });
    }
  } catch (error) {
    console.error("Error deleting Kasjalan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};
