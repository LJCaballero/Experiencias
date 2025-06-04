import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

// Importar rutas principales
import router from "./src/routes/index.js";

// Importar middlewares específicos
// import upload from "./src/middlewares/uploadFiles.js";  // Comentado por ahora
import notFoundHandler from "./src/middlewares/notFoundHandler.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import auth from "./src/middlewares/authMiddleware.js";

// Inicializar aplicación Express
const app = express();

// Middleware básicos
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Middleware para manejar archivos estáticos
app.use("/uploads", express.static("uploads"));

// Usar todas las rutas del sistema (users, experiences, admin, etc.)
app.use(router);

// Middlewares de manejo de errores (van al final)
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(` Servidor corriendo en http://localhost:${PORT}`)
);