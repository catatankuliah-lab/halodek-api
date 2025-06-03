import express from "express";
import * as paController from "../controller/paController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  paController.getPAFilter
);

router.post(
  "/pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  paController.createPA
);

router.get(
  "/pa/:id_pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  paController.getPAByIdPA
);

router.put(
  "/pa/:id_pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  paController.updatePAByIdPA
);

export default router;
