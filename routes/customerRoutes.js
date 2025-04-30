import express from "express";
import * as customerController from "../controller/customerController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/customer",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10, 13]),
  customerController.getAllCustomers
);

router.get(
  "/customer/:id_customer",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10, 13]),
  customerController.getCustomerById
);

router.post(
  "/customer",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]),
  customerController.createCustomer
);

router.put(
  "/customer/:id_customer",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10]),
  customerController.updateCustomer
);

router.get("/dev/customer", customerController.getAllCustomers);
router.get("/dev/customer/:id_customer", customerController.getCustomerById);
router.post("/dev/customer", customerController.createCustomer);
router.put("/dev/customer/:id_customer", customerController.updateCustomer);

export default router;
