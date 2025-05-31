import selectExperienceByIdService from "../../services/experiences/selectExperienceByIdService.js";

const getExperienceByIdController = async (req, res, next) => {
  try {
    const { experienceId } = req.params;

    const experience = await selectExperienceByIdService(experienceId);

    if (!experience) {
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
