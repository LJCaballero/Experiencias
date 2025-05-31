import getPool from "../../database/getPool.js";

const insertExperienceService = async (
  title,
  description,
  locality,
  image,
  experienceDate,
  price,
  minCapacity,
  totalCapacity,
  adminId
) => {
  const pool = await getPool();

  //Insertar los datos en la BD

  const [result] = await pool.query(
    `
        INSERT INTO experiences (title, description, locality, image, experienceDate, price, minCapacity, totalCapacity, adminId, active, confirmed)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, true, false)
        `,
    [
      id,
      title,
      description,
      locality,
      image,
      experienceDate,
      price,
      minCapacity,
      totalCapacity,
      adminId,
    ]
  );

  const { insertId } = result;

  return insertId;
};

export default insertExperienceService;
