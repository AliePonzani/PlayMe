import { novoUsuario } from "../repository/userRepository.js";

import { Router } from "express";
let servidor = Router();

servidor.post('/usuario', async (req, resp) => {
    let usuario = req.body;

    let usuarioInserido = await novoUsuario(usuario);
    resp.send(usuarioInserido);
})

export default servidor;