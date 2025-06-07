// Endpoint detalle de la experiencia
import express from "express";
import getPool from "../../database/getPool.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const idNum = Number(id);
        const pool = await getPool();

        const [rows] = await pool.query(
            "SELECT * FROM experiences WHERE id = ?",
            [idNum]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Experiencia no encontrada" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener el detalle de la experiencia:", error);
        res
        .status(500)
        .json({ error: "Error al obtener el detalle de la experiencia" });
    }
});

export default router;
