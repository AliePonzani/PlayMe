import usuarioController from "../src/controller/usuarioController.js";
import timeController from "../src/controller/timeController.js";

import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const servidor = express();
servidor.use(cors());
servidor.use(express.json());

servidor.use(usuarioController);
servidor.use(timeController);

let port = process.env.PORT;
servidor.listen(port, () => console.log("API SUBIU!"));