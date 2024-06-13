import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import usuarioController from "../src/controller/usuarioController.js";
import timeController from "../src/controller/timeController.js";
import participanteController from "../src/controller/participanteController.js";
import login from "../src/controller/login.js";
import modalidades from "../src/controller/modalidades.js";


const servidor = express();
servidor.use(cors());
servidor.use(express.json());

servidor.use(usuarioController);
servidor.use(timeController);
servidor.use(participanteController);
servidor.use(login);
servidor.use(modalidades);


servidor.use('/storage/usuario', express.static('storage/usuario'));

servidor.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erro interno do servidor');
});

let port = process.env.PORT;
servidor.listen(port, () => console.log("API SUBIU!"));

export default servidor;