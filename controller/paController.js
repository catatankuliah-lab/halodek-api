import PA from "../models/paModel.js";
import multer from "multer";
const upload = multer();

export const getPAFilter = async (req, res) => {
  const { page = 1, limit = 10, nama, no_hp, status } = req.query;
  try {
    const { data, total } = await PA.getPAFilter(
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

export const createPA = async (req, res) => {
  const { id_user, jumlah_mahasiswa_aktif, status } = req.body;
  try {
    const pa = await PA.addPA(id_user, jumlah_mahasiswa_aktif, status);
    res.status(201).json({
      status: "success",
      data: {
        pa
      },
      message: "PA created successfully.",
    });
  } catch (error) {
    console.error("Error creating PA:", error);
    res.status(500).json({
      status: "error",
      data: null,
      message: "Internal Server Error",
    });
  }
};

export const getPAByIdPA = async (req, res) => {
  const { id_pa } = req.params;
  try {
    const pa = await PA.getPAByIdPA(id_pa);
    if (pa) {
      res.status(200).json({
        status: "success",
        data: pa,
        message: "PA fetched successfully.",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "PA not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching PA by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updatePAByIdPA = async (req, res) => {
  const { id_pa } = req.params;

  upload.single("foto_pa")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }

    try {
      const dataUpdate = { ...req.body };

      if (req.file) {

        const uploadPath = path.join(
          "uploads",
          "pa"
        );

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        const newFileName = `foto_pa_${id_pa}.jpg`;
        const filePath = path.join(uploadPath, newFileName);

        fs.writeFileSync(filePath, req.file.buffer);

        dataUpdate.foto_pa = path.join(uploadPath, newFileName);
      }

      const updated = await PA.updatePAByIdPA(id_pa, dataUpdate);

      if (updated) {
        res.status(200).json({
          status: "success",
          message: "PA updated successfully.",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "PA not found or no data changed.",
        });
      }
    } catch (error) {
      console.error("Error updating PA by ID:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });
};