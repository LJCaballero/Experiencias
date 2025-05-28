import "dotenv/config";
import server from "./src/server.js";
import getPool from "./src/database/getPool.js";

const iniciarAplicacion = async () => {
  try {
    await getPool();
    console.log("BD conectada exitosamente");

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicación", error);
    process.exit(1);
  }
};

iniciarAplicacion();
