import Cicilan from "../models/cicilanModel.js";
import Armada from "../models/armadaModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const upload = multer();

export const getAllCicilan = async (req, res) => {
  try {
    const cicilan = await Cicilan.getAllCicilan({
      include: [{
        model: Armada,
        key: 'id_armada',
        required: true, // Untuk memastikan join dengan tabel armada
      }]
    });
    res.status(200).json({
      status: "success",
      data: cicilan,
      message: "Cicilan fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching cicilan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getCicilanById = async (req, res) => {
  const { id_cicilan } = req.params;

  try {
    const cicilan = await Cicilan.getCicilanById(id_cicilan);
    res.status(200).json({
      status: "success",
      data: cicilan,
      message: "Cicilan fetched successfully by PO ID."
    });
  } catch (error) {
    console.error("Error fetching Kasjalan by PO ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const createCicilan = async (req, res) => {
  const cicilanData = req.body;
  try {
    const newCicilan = await Cicilan.addCicilan(cicilanData);
    res.status(201).json({
      status: "success",
      data: newCicilan,
      message: "Cicilan created successfully.",
    });
  } catch (error) {
    console.error("Error creating cicilan:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateCicilan = async (req, res) => {
  const { id_cicilan } = req.params;
  const cicilanData = req.body;

  try {
    const updateCicilan = await Cicilan.updateCicilan(id_cicilan, cicilanData);
    res.status(200).json({
      status: "success",
      data: updateCicilan,
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