import express from "express";
import * as konsultasiController from "../controller/konsultasiController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.get(
//   "/konsultasi",
//   authMiddleware.authenticate,
//   authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
//   konsultasiController.getKonsultasiFilter
// );

router.get(
  "/konsultasi/:id_user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konsultasiController.getKonsultasiByIdUserFilter
);

router.get(
  "/konsultasikonselor/:id_user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konsultasiController.getKonsultasiByIdUserFilterKonselor
);

router.post(
  "/konsultasi",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konsultasiController.createKonsultasi
);

export default router;
