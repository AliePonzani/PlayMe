import { deletarTime } from "../repository/timeRepository.js";
import { alterarUsuario, deletarUsuario, exibirUsuario, exibirUsuarios, listarTimesUsuario, novoUsuario } from "../repository/userRepository.js";

import { Router } from "express";
let servidor = Router();

servidor.get('/usuario', async(req, resp) => {
    let usuarios = await exibirUsuarios();
    resp.send(usuarios);
})

servidor.get('/usuario/:id', async(req, resp) => {
    const id = req.params.id;
    let usuario = await exibirUsuario(id);
    resp.send(usuario);
})

servidor.get('/timesusuario/:id', async(req, resp) => {
    try {
        const id = req.params.id;
        let times = await listarTimesUsuario(id);
        resp.send(times);
    } catch (error) {
        throw error;   
    }
})

servidor.post('/usuario', async (req, resp) => {
    let usuario = req.body;

    let usuarioInserido = await novoUsuario(usuario);
    resp.send(usuarioInserido);
})

servidor.put('/usuario/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const usuario = req.body;

        const usuarioAtualizado = await alterarUsuario(id, usuario);
        resp.status(200).json(usuarioAtualizado);
    } catch (error) {
        resp.status(500).json({ message: 'Erro ao alterar os dados!', error: error.message });
    }
})

servidor.delete('/usuario/:id', async(req,resp) =>{
    try {
        const id = req.params.id;
        const timesUsuario = await listarTimesUsuario(id);

        for (const time of timesUsuario) {
            await deletarTime(time.idTime, time);
        }

        await deletarUsuario(id);
        resp.status(200).json("Usuário deletado com sucesso!");
    } catch (error) {
        resp.status(500).json({message: 'Erro ao excluir usuário!', error: error.message});
    }
})

export default servidor;