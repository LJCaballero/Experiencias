import selectExperienceByIdService from "../../services/experiences/selectExperienceByIdService.js";

const getExperienceByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validamo que el ID sea un número entero positivo
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      const error = new Error("ID de experiencia inválido.");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const experience = await selectExperienceByIdService(id); // Pasamos el ID al servicio

    if (!experience) {
      // Si el servicio no encuentra la experiencia, lanzamos un error 404
      const error = new Error("Experiencia no encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }

    // Si la experiencia se encuentra, la devolvemos
    res.status(200).json({
      status: "ok",
      message: "Detalle de la experiencia",
      data: {
        experience,
      },
    });
  } catch (error) {
    // Pasa cualquier error (incluidos los lanzados arriba) al middleware de gestión de errores
    next(error);
  }
};

export default getExperienceByIdController;
