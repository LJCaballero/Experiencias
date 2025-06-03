// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error 500",
    message: "Ha ocurrido un error en el servidor.",
  });
};

module.exports = errorHandler;
