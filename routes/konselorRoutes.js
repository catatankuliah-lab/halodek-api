import express from "express";
import * as konselorController from "../controller/konselorController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  konselorController.createKonselor
);

router.get(
  "/konselor/:id_konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  konselorController.getKonselorByIdKonselor
);

router.put(
  "/konselor/:id_konselor",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  konselorController.updateKonselorByIdKonselor
);

export default router;
