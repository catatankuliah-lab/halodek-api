import express from "express";
import * as kasjalanController from "../controller/kasjalanController.js"; // Pastikan file controller sudah dibuat
import * as authMiddleware from "../middlewares/authMiddleware.js"; // Pastikan middleware sudah tersedia

const router = express.Router();

// Routes untuk Kas Jalan dengan otentikasi dan otorisasi
router.get(
  "/kasjalan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10]), // Sesuaikan peran yang diizinkan
  kasjalanController.getAllKasjalan
);

router.get(
  "/kasjalan/:id_kas_jalan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10]),
  kasjalanController.getKasjalanById
);

router.get(
  "/kasjalan/po/:id_po",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10]),
  kasjalanController.getKasjalanByIdPO
);

router.post(
  "/kas_jalan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Sesuaikan peran yang diizinkan untuk menambahkan data
  kasjalanController.addKasjalan
);

router.put(
  "/kasjalan/:id_kas_jalan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Sesuaikan peran yang diizinkan untuk memperbarui data
  kasjalanController.updateKasjalan
);

router.delete(
  "/kasjalan/:id_kas_jalan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Sesuaikan peran yang diizinkan untuk menghapus data
  kasjalanController.deleteKasjalan
);

// Routes untuk pengembangan (tanpa otentikasi dan otorisasi)
router.get("/dev/kasjalan", kasjalanController.getAllKasjalan);
router.get("/dev/kasjalan/:id_kas_jalan", kasjalanController.getKasjalanById);
router.get("/dev/kasjalan/po/:id_po", kasjalanController.getKasjalanByIdPO);
router.post("/dev/kas_jalan", kasjalanController.addKasjalan);
router.put("/dev/kasjalan/:id_kas_jalan", kasjalanController.updateKasjalan);
router.delete("/dev/kasjalan/:id_kas_jalan", kasjalanController.deleteKasjalan);

export default router;
