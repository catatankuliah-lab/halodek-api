import express from "express";
import * as itemKonsultasiController from "../controller/itemKonsultasiController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/itemkonsultasi",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  itemKonsultasiController.createItemKonsultasi
);

router.get(
  "/itemkonsultasi/:id_konsultasi",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  itemKonsultasiController.getItemKonsultasiByIdKonsultasi
);

export default router;
