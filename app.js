import express from "express";
import cors from "cors";
import multer from "multer"; // Tambahkan multer
import sequelize from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import jeniskendaraanRoutes from "./routes/jeniskendaraanRoutes.js";
import kabupatenkotaRoutes from "./routes/kabupatenkotaRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import armadaRoutes from "./routes/armadaRoutes.js";
import kasjalanRoutes from "./routes/kasjalanRoutes.js";
import poRoutes from "./routes/poRoutes.js";
import titikbongkarRoutes from "./routes/titikbongkarRoutes.js";
import cicilanRoutes from "./routes/cicilanRoutes.js";

const app = express();
const PORT = process.env.PORT || 3090;
const upload = multer(); // Inisialisasi multer

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware untuk membaca JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

const init = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to the database.");
        await sequelize.sync();
        console.log("Database & tables created!");

        app.use("/api/v1", authRoutes);
        app.use("/api/v1", roleRoutes);
        app.use("/api/v1", userRoutes);
        app.use("/api/v1", customerRoutes);
        app.use("/api/v1", jeniskendaraanRoutes);
        app.use("/api/v1", kabupatenkotaRoutes);
        app.use("/api/v1", driverRoutes);
        app.use("/api/v1", armadaRoutes);
        app.use("/api/v1", kasjalanRoutes);
        app.use("/api/v1", poRoutes);
        app.use("/api/v1", titikbongkarRoutes);
        app.use("/api/v1", cicilanRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

init();