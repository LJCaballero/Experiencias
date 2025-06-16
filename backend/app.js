import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import router from "./src/routes/index.js";
import notFoundHandler from "./src/errors/notFoundHandler.js";
import errorHandler from "./src/errors/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

// ← QUITA ESTA PARTE
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () =>
//   console.log(` Servidor corriendo en http://localhost:${PORT}`)
// );

export default app; // ← Solo exporta la app