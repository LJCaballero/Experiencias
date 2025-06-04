import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import "dotenv/config";
import morgan from "morgan";

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan("dev"));

server.use(router);

export default server;
