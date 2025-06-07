import joi from "joi";
import insertReservationService from "../../services/experiences/insertReservationService.js";

const createReservationController = async (req, res, next) => {
  try {
    const schema = joi.object({
      numberOfPeople: joi.number().integer().min(1).required().messages({
        "any.required": "El número de personas es obligatorio",
        "number.min": "Debe ser al menos 1 persona"
      }),
      experienceDate: joi.date().min("now").required().messages({
        "any.required": "La fecha de la experiencia es obligatoria",
        "date.min": "La fecha debe ser futura"
      })
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: "Datos de entrada inválidos",
        details: error.details
      });
    }

    const { numberOfPeople, experienceDate } = value;
    const experienceId = req.params.id;
    const userId = req.user.id; 

    const reservationId = await insertReservationService(
      experienceId,
      userId,
      experienceDate,
      numberOfPeople
    );

    res.status(201).json({
      status: "ok",
      message: "Reserva creada exitosamente",
      data: {
        reservation: {
          id: reservationId,
          experienceId: Number(experienceId),
          userId,
          experienceDate,
          numberOfPeople,
          status: "pending"
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

export default createReservationController;