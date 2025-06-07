import selectExperienceByIdService from "../../services/experiences/selectExperienceByIdService.js";

const getExperienceByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validamos que el ID es un número válido
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ 
        error: "ID inválido",
        message: "El ID debe ser un número entero positivo"
      });
    }

    const experience = await selectExperienceByIdService(id);

    if (!experience) {
      return res.status(404).json({ 
        error: "Experiencia no encontrada",
        message: "No existe una experiencia con ese ID"
      });
    }

    res.status(200).json({
      status: "ok",
      data: {
        experience
      }
    });

  } catch (error) {
    next(error);
  }
};

export default getExperienceByIdController;
