import express from "express";
import * as kabupatenKotaController from "../controller/kabupatenkotaController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes untuk kabupaten/kota dengan otentikasi dan otorisasi
router.get(
  "/kabupaten-kota",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10]),
  kabupatenKotaController.getAllKabupatenKota
);

router.get(
  "/kabupaten-kota/:id_kabupaten_kota",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10]),
  kabupatenKotaController.getKabupatenKotaById
);

router.post(
  "/kabupaten-kota",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]),
  kabupatenKotaController.createKabupatenKota
);

router.put(
  "/kabupaten-kota/:id_kabupaten_kota",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1]),
  kabupatenKotaController.updateKabupatenKota
);

// Routes untuk pengembangan (tanpa otentikasi dan otorisasi)
router.get("/dev/kabupaten-kota", kabupatenKotaController.getAllKabupatenKota);
router.get("/dev/kabupaten-kota/:id_kabupaten_kota", kabupatenKotaController.getKabupatenKotaById);
router.post("/dev/kabupaten-kota", kabupatenKotaController.createKabupatenKota);
router.put("/dev/kabupaten-kota/:id_kabupaten_kota", kabupatenKotaController.updateKabupatenKota);

export default router;
