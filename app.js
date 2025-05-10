import express from "express";
import cors from "cors";
import multer from "multer";
import sequelize from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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
        app.use("/api/v1", roleRoutes);
        app.use("/api/v1", userRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

init();