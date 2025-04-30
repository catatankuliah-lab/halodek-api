import express from "express";
import * as jenisKendaraanController from "../controller/jeniskendaraanController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/jenis-kendaraan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8, 9, 11, 12]),
  jenisKendaraanController.getAllJenisKendaraan
);

router.get(
  "/jenis-kendaraan/:id_jenis_kendaraan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8, 9, 11, 12]),
  jenisKendaraanController.getJenisKendaraanById
);

// Dev routes
router.get("/dev/jenis-kendaraan", jenisKendaraanController.getAllJenisKendaraan);
router.get("/dev/jenis-kendaraan/:id_jenis_kendaraan", jenisKendaraanController.getJenisKendaraanById);

export default router;
