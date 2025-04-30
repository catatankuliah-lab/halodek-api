import express from "express";
import * as driverController from "../controller/driverController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 8, 9, 10, 13]),
  driverController.getAllDriver
);

router.get(
  "/driverdetailpage/:id_driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 8, 9, 10, 13]),
  driverController.getAllDriverDetailPage
);

router.get(
  "/drivers",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 8, 9, 10, 13]),
  driverController.getAllDrivers
);

router.get(
  "/driver/availability",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 9]),
  driverController.getDriverAvailability
);

router.get(
  "/driver/:id_driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 9, 10]),
  driverController.getDriverById
);

router.post(
  "/driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 9, 10]),
  driverController.addDriver
);

router.put(
  "/driver/status/:id_driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]),
  driverController.updateStatusDriver
);

router.put(
  "/driver/:id_driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 9, 10]),
  driverController.updateDriver
);

router.delete(
  "/driver/:id_driver",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 7, 9, 10]),
  driverController.deleteDriver
);

export default router;