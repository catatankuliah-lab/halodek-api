import express from "express";
import * as mahasiswaController from "../controller/mahasiswaController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/mahasiswa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  mahasiswaController.getMahasiswaFilter
);

router.get(
  "/mahasiswa/iduser/:id_mahasiswa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  mahasiswaController.getMahasiswaByIdMahasiswa
);

router.get(
  "/mahasiswa/user/:id_user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  mahasiswaController.getMahasiswaByIdUser
);

router.get(
  "/mahasiswa/:id_mahasiswa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  mahasiswaController.getMahasiswaByIdMahasiswa
);

router.put(
  "/mahasiswa/:id_mahasiswa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  mahasiswaController.updateMahasiswaByIdMahasiswa
);

export default router;
