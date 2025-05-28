import dotenv from "dotenv"
dotenv.config();
import mysql from "mysql2/promise";




const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

const getPool = async () => {
    try {
        if (!pool) {
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
                database: MYSQL_DATABASE,
                timezone: "Z",
            });

        const BDconnection = await pool.getConnection();
        BDconnection.release(); 
        console.log('Pool de conexiones MySQL creado exitosamente');

        } return pool;

    } catch (error){
        console.error('Error al crear el pool de conexiones', error);
        throw error;
        //throw aqui iria mi generateErrors utils
    }
};

export default getPool;