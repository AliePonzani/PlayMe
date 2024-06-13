import multer from "multer";

import { deletarTime } from "../repository/timeRepository.js";
import { alterarImagem, alterarUsuario, deletarUsuario, exibirUsuario, exibirUsuarios, listarTimesUsuario, novoUsuario } from "../repository/userRepository.js";

import { Router } from "express";
import { deletarParticipante, listarTimesPorParticipante } from "../repository/participanteRepository.js";
let servidor = Router();
const upload = multer({ dest: 'storage/usuario' });

servidor.get('/usuario', async (req, resp) => {
    try {
        let usuarios = await exibirUsuarios();
        resp.status(200).send(usuarios);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
})

servidor.get('/usuario/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        let usuario = await exibirUsuario(id);
        resp.status(200).send(usuario);
    } catch (error) {
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
})

servidor.get('/timesusuario/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        let times = await listarTimesUsuario(id);
        resp.status(200).json(times);
    } catch (error) {
        resp.status(500).json("Erro ao buscar times do usuario" + error);
    }
})

servidor.post('/usuario', async (req, resp) => {
    try {
        let usuario = req.body;
        let usuarioInserido = await novoUsuario(usuario);
        resp.status(200).json(usuarioInserido);
    } catch (error) {
        if (error.message === 'EMAIL_JA_EXISTE') {
            resp.status(409).json({ message: 'Já existe um usuário com este e-mail cadastrado!' });
        } else {
            resp.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    }
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

servidor.put('/usuario/imagem/:id', upload.single('imgUsuario'), async (req, resp) => {
    try {
        let id = req.params.id;
        let imagem = req.file.path;
        let linhasAfetadas = await alterarImagem(id, imagem);
        if (linhasAfetadas == 0) {
            resp.status(404).send();
        } else {
            resp.status(200).send();
        }
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

servidor.delete('/usuario/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const timesUsuario = await listarTimesUsuario(id);
        const timesQueParticipa = await listarTimesPorParticipante(id);

        for (const time of timesQueParticipa) {
            await deletarParticipante(time.id);
        }

        for (const time of timesUsuario) {
            await deletarTime(time.id);
        }

        await deletarUsuario(id);
        resp.status(200).json("Usuário deletado com sucesso!");
    } catch (error) {
        resp.status(500).json({ message: 'Erro ao excluir usuário!', error: error.message });
    }
})

export default servidor;