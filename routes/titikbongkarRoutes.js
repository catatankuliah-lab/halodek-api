import express from "express";
import * as titikBongkarController from "../controller/titikbongkarController.js"; // Ensure the controller is created
import * as authMiddleware from "../middlewares/authMiddleware.js"; // Ensure middleware is available

const router = express.Router();

// Routes for Titik Bongkar with authentication and authorization
router.get(
  "/titikbongkar",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Adjust roles that are allowed
  titikBongkarController.getAllTitikBongkar
);

router.get(
  "/titikbongkar/:id_titik_bongkar",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 13]),
  titikBongkarController.getTitikBongkarById
);

router.get(
  "/titikbongkar/po/:id_po",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 13]),
  titikBongkarController.getTitikBongkarByPO
);

router.post(
  "/titikbongkar",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Adjust roles that are allowed to add data
  titikBongkarController.addTitikBongkar
);

router.put(
  "/titikbongkar/upload/:id_titik_bongkar",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 13]), // Adjust roles that are allowed to update data
  titikBongkarController.uploadTitikBongkar
);

router.put(
  "/titikbongkar/:id_titik_bongkar",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Adjust roles that are allowed to update data
  titikBongkarController.updateTitikBongkar
);

router.delete(
  "/titikbongkar/:id_titik_bongkar",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]), // Adjust roles that are allowed to delete data
  titikBongkarController.deleteTitikBongkar
);

// Routes for development (without authentication and authorization)
router.get("/dev/titikbongkar", titikBongkarController.getAllTitikBongkar);
router.get("/dev/titikbongkar/:id_titik_bongkar", titikBongkarController.getTitikBongkarById);
router.get("/dev/titikbongkar/po/:id_po", titikBongkarController.getTitikBongkarByPO);
router.post("/dev/titikbongkar", titikBongkarController.addTitikBongkar);
router.put("/dev/titikbongkar/:id_titik_bongkar", titikBongkarController.updateTitikBongkar);
router.delete("/dev/titikbongkar/:id_titik_bongkar", titikBongkarController.deleteTitikBongkar);

export default router;
