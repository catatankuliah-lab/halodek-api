import express from "express";
import * as konselorController from "../controller/konselorController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konselorController.getKonselorFilter
);

router.post(
  "/konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konselorController.createKonselor
);

router.get(
  "/konselor/:id_konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konselorController.getKonselorByIdKonselor
);

router.get(
  "/konselor/iduser/:id_user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konselorController.getKonselorByIdUser
);

router.put(
  "/konselor/:id_konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit', 'mahasiswa', 'konselor', 'pa', 'orangtua']),
  konselorController.updateKonselorByIdKonselor
);

export default router;
