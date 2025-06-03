import express from "express";
import experiencesRoutes from "./routes/experiencesRoutes.js";

const app = express();

app.use(express.json());

// Rutas
app.use("/experiences", experiencesRoutes);

// Middleware de error (opcional)
// app.use((err, req, res, next) => { ... });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
