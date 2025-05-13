import express from "express";
import * as userController from "../controller/userController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  userController.getAllUsers
);

router.get(
  "/user/:id_user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  userController.getUserById
);

router.post(
  "/user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  userController.createUser
);

router.put(
  "/user/:id_user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(['kepala_unit']),
  userController.updateUser
);

router.get("/dev/user", userController.getAllUsers);
router.post("/dev/user", userController.createUser);

export default router;
