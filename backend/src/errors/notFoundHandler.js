// Middleware 404 not found handler

const notFoundHandler = (req, res, next) => {
  res.status(400).json({
    error: "Error 400",
    message: "Página no encontrada.",
  });
};

export default notFoundHandler;
