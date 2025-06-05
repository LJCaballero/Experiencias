// backend/src/controllers/experiences/listExperiencesController.js
import selectAllExperiencesService from "../../services/experiences/selectAllExperiencesService.js";

const listExperiencesController = async (req, res, next) => {
  try {
    const experiences = await selectAllExperiencesService();
    res.status(200).json(experiences);
  } catch (error) {
    next(error); 
  }
};

export default listExperiencesController;
