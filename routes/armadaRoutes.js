import express from "express";
import * as armadaController from "../controller/armadaController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10, 12, 13]),
  armadaController.getAllArmada
);

router.get(
  "/armadadetailpage/:id_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10, 12, 13]),
  armadaController.getAllArmadaDetailPage
);

router.get(
  "/armadas",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10, 12, 13]),
  armadaController.getAllArmadas
);

router.get(
  "/armada/availability",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 12]),
  armadaController.getArmadaAvailability
);

router.get(
  "/armada/:id_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 8, 9, 10, 12]),
  armadaController.getArmadaById
);

router.get(
  "/armada/jenis/:id_jenis_kendaraan",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 12, 13]),
  armadaController.getArmadaByJenisKendaraan
);

router.get(
  "/armada/nopol/:nopol_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 12, 13]),
  armadaController.getArmadaByNopol
);

router.post(
  "/armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 12]), // Adjust the roles that are allowed to add data
  armadaController.addArmada
);

router.put(
  "/armada/status/:id_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 12]),
  armadaController.updateStatusArmada
);

router.put(
  "/armada/:id_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 12]),
  armadaController.updateArmada
);

router.delete(
  "/armada/:id_armada",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 10, 12]),
  armadaController.deleteArmada
);

router.get(
  "/armada/availability",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1, 2, 3, 9, 12]),
  armadaController.getArmadaRiwayatBulanan
);

export default router;
