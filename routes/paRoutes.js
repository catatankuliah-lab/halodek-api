import express from "express";
import * as paController from "../controller/paController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  paController.createPA
);

router.get(
  "/pa/:id_pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  paController.getPAByIdPA
);

router.put(
  "/pa/:id_pa",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  paController.updatePAByIdPA
);

export default router;
