const isAdmin = (req, res, next) => {
  // Suponiendo que el usuario tiene un campo "role" y "admin" es el valor para administradores
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Acceso solo para administradores" });
};

export default isAdmin;