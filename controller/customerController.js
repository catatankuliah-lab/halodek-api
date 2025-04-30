import Customer from "../models/customerModel.js";
import multer from "multer";
const upload = multer();

export const getAllCustomers = async (req, res) => {
  const { page = 1, limit = 10, nama_customer, alamat_customer} = req.query;
    try {
      const { data, total } = await Customer.getAllCustomers(
        parseInt(page),
        parseInt(limit),
        { nama_customer, alamat_customer}
      );
  
      res.json({
        data,
        currentPage: parseInt(page),
        limit: parseInt(limit),
        totalData: total,
        totalPages: Math.ceil(total / parseInt(limit)),
      });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const getCustomerById = async (req, res) => {
  const { id_customer } = req.params;

  try {
    const customer = await Customer.getCustomerById(id_customer);
    if (customer) {
      res.status(200).json({
        status: "success",
        data: customer,
        message: "Customer fetched successfully."
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Customer not found."
      });
    }
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

export const createCustomer = async (req, res) => {
  const { nama_customer, alamat_customer, penanggung_jawab_customer, nomor_penanggung_jawab_customer, jumlah_order } = req.body;

  try {
    await Customer.addCustomer(nama_customer, alamat_customer, penanggung_jawab_customer, nomor_penanggung_jawab_customer, jumlah_order);

    res.status(201).json({
      status: "success",
      data: { nama_customer, alamat_customer, penanggung_jawab_customer, nomor_penanggung_jawab_customer, jumlah_order },
      message: "Customer created successfully."
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      status: "error",
      data: null,
      message: "Internal Server Error"
    });
  }
};

export const updateCustomer = async (req, res) => {
  const { id_customer } = req.params;
  const customerData = req.body;

  try {
    const updatedCustomer = await Customer.updateCustomer(id_customer, customerData);
    if (updatedCustomer) {
      
    } else {
      res.status(404).json({
        status: "error",
        message: "Customer not found."
      });
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};
