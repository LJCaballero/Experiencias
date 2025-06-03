import express from "express";
import experiencesRoutes from "./routes/experiencesRoutes.js";
import jwt from "jsonwebtoken";

// Importar Middlewares
import verificarToken from "./middlewares/authMiddleware.js";
import cors from "./middlewares/cors.js";
import upload from "./middlewares/uploadFiles.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

// Inicializar aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para manejar archivos estáticos
app.use("/uploads", express.static("uploads"));

// Middleware de CORS
app.use(cors());

//  Ruta protegida para crear experiencias con subida de archivo
app.post(
    "/experiencias",
    verificarToken,
    upload.single("archivo"),
    (req, res) => {
        const nuevaExperiencia = req.body;
        // Si se subió un archivo, agregar la ruta al objeto de respuesta
        if (req.file) {
        nuevaExperiencia.archivo = `/uploads/${req.file.filename}`;
    }
    res.status(201).json({
        mensaje: "Experiencia creada correctamente",
        experiencia: nuevaExperiencia,
    });
    }
);



// Otros middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
