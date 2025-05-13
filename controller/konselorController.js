import Konselor from "../models/konselorModel.js";
import multer from "multer";
const upload = multer();

export const createKonselor = async (req, res) => {
  const { id_user, status } = req.body;
  try {
    const konslor = await Konselor.addKonselor(id_user, status);
    res.status(201).json({
      status: "success",
      data: {
        konslor
      },
      message: "Konselor created successfully.",
    });
  } catch (error) {
    console.error("Error creating Konselor:", error);
    res.status(500).json({
      status: "error",
      data: null,
      message: "Internal Server Error",
    });
  }
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


export const updateKonselorByIdKonselor = async (req, res) => {
  const { id_konselor } = req.params;

  upload.single("foto_konselor")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }

    try {
      const dataUpdate = { ...req.body };

      if (req.file) {

        const uploadPath = path.join(
          "uploads",
          "konselor"
        );

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        const newFileName = `foto_konselor_${id_pa}.jpg`;
        const filePath = path.join(uploadPath, newFileName);

        fs.writeFileSync(filePath, req.file.buffer);

        dataUpdate.foto_konselor = path.join(uploadPath, newFileName);
      }

      const updated = await Konselor.updateKonselorByIdKonselor(id_konselor, dataUpdate);

      if (updated) {
        res.status(200).json({
          status: "success",
          message: "Konselor updated successfully.",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Konselor not found or no data changed.",
        });
      }
    } catch (error) {
      console.error("Error updating Konselor by ID:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });
};