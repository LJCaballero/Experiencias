import joi from "joi";
import insertExperienceService from "../../services/experiences/insertExperienceService.js";
import selectExperienceByIdService from "../../services/experiences/selectExperienceByIdService.js";

const newExperienceController = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().min(3).required().messages({
        "any.required": "El titulo es obligatorio",
      }),
      description: joi.string().min(10).required().messages({
        "any.required": "La descripcion es obligatoria",
      }),
      locality: joi.string().min(3).required().messages({
        "any.required": "Escribe un lugar donde se celebrara la experiencia",
      }),
      image: joi.string().allow(null, "").optional(),
      experienceDate: joi.date().min("now").required().messages({
        "any.required": "Define un dia y una hora",
      }),
      price: joi.number().positive().precision(2).required().messages({
        "any.required": "Especifica el precio",
      }),
      minCapacity: joi.number().integer().min(1).default(1),
      totalCapacity: joi.number().integer().min(1).required().messages({
        "any.required": " Establece un numero maximo de personas",
      }),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      throw error;
    }

    const {
      title,
      description,
      locality,
      image,
      experienceDate,
      price,
      minCapacity = 1,
      totalCapacity,
    } = value;

    //Obtencion del ID del admin del token JWT

    const adminId = req.user.id;

    const experienceId = await insertExperienceService(
      title,
      description,
      locality,
      image,
      experienceDate,
      price,
      minCapacity,
      totalCapacity,
      adminId
    );

    //Obtener los datos completos de la experiencia

    const experience = await selectExperienceByIdService(experienceId);

    res.status(201).json({
      status: "ok",
      message: "Experiencia creada exitosamente",
      data: {
        experience,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default newExperienceController;
