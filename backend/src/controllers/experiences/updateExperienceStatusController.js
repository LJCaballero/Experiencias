  import joi from "joi";
  import updateExperienceStatusService from "../../services/experiences/updateExperiencesStatusService.js";

  const updateExperienceStatusController = async (req, res, next) => {
    try {
      // 1. Validación de entrada con Joi
      const schema = joi.object({
        active: joi.boolean().optional().messages({
          "boolean.base": "El campo 'active' debe ser true o false"
        }),
        confirmed: joi.boolean().optional().messages({
          "boolean.base": "El campo 'confirmed' debe ser true o false"
        })
      }).min(1).messages({
        "object.min": "Debes proporcionar al menos un campo para actualizar (active o confirmed)"
      });

      

      const { error, value } = schema.validate(req.body);
      

      if (error) {
        return res.status(400).json({
          error: "Datos de entrada inválidos",
          details: error.details.map(detail => detail.message)
        });
      }

      // 2. Verificamos que el usuario es administrador
      if (req.user.admin) {
        return res.status(403).json({
          error: "Acceso denegado",
          message: "Solo los administradores pueden modificar el estado de las experiencias"
        });
      }

      // 3. Validamos que el ID de experiencia es válido
      const experienceId = req.params.id;
      if (!Number.isInteger(Number(experienceId)) || Number(experienceId) <= 0) {
        return res.status(400).json({
          error: "ID inválido",
          message: "El ID de la experiencia debe ser un número entero positivo"
        });
      }

      // 4. Llamamos al servicio para actualizar
      const updatedExperience = await updateExperienceStatusService(
        experienceId,
        value
      );

      // 5. Preparamos respuesta con información del cambio
      const statusChanges = [];
      if (value.active !== undefined) {
        statusChanges.push(`${value.active ? 'Activada' : 'Desactivada'}`);
      }
      if (value.confirmed !== undefined) {
        statusChanges.push(`${value.confirmed ? 'Confirmada' : 'Sin confirmar'}`);
      }

      res.status(200).json({
        status: "ok",
        message: `Experiencia actualizada: ${statusChanges.join(' y ')}`,
        data: {
          experience: updatedExperience
        }
      });

    } catch (error) {
      next(error);
    }
  };

  export default updateExperienceStatusController;