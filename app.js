import express from "express";
import cors from "cors";
import multer from "multer";
import sequelize from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import konselorRoutes from "./routes/konselorRoutes.js";
import paRoutes from "./routes/paRoutes.js";
import mahasiswaRoutes from "./routes/mahasiswaRoutes.js";
import konsultasiRoutes from "./routes/konsultasiRoutes.js";
import itemKonsultasiRoutes from "./routes/itemKonsultasiRoutes.js";

const app = express();
const PORT = process.env.PORT || 2018;
const upload = multer();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

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
        app.use("/api/v1", userRoutes);
        app.use("/api/v1", konselorRoutes);
        app.use("/api/v1", paRoutes);
        app.use("/api/v1", mahasiswaRoutes);
        app.use("/api/v1", konsultasiRoutes);
        app.use("/api/v1", itemKonsultasiRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

init();