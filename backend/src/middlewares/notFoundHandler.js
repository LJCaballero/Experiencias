// Middleware 404 not found handler

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "Error 404",
    message: "Página no encontrada.",
  });
};

export default notFoundHandler;
