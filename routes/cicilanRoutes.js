import express from "express";
import * as cicilanController from "../controller/cicilanController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all cicilan with armada details
router.get(
  "/cicilan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8]),
  cicilanController.getAllCicilan
);

// Get cicilan by id with armada details
router.get(
  "/cicilan/armada/:id_cicilan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8]),
  cicilanController.getCicilanById
);

router.get(
  "/cicilan/:id_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8]),
  cicilanController.getCicilanById
);

// Create new cicilan entry
router.post(
  "/cicilan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8]),
  cicilanController.createCicilan
);

// Update cicilan by id
router.put(
  "/cicilan/:id_cicilan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 8]),
  cicilanController.updateCicilan
);

router.get("/dev/cicilan", cicilanController.getAllCicilan);
router.get("/dev/cicilan/:id_cicilan", cicilanController.getCicilanById);
router.post("/dev/cicilan", cicilanController.createCicilan);
router.put("/dev/cicilan/:id_cicilan", cicilanController.updateCicilan);

export default router;
