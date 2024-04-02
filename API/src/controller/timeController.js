import { listarCategorias, listarModalidades, listarSubcategorias, listarTimes, novoTime } from "../repository/timeRepository.js";

import { Router } from "express";
let servidor = Router();

servidor.post('/time', async (req, resp) => {
    let time = req.body;

    let timeCriado = await novoTime(time);
    resp.send(timeCriado);
})

servidor.get('/time', async (req, resp) => {
    let listaTimes = await listarTimes();
    resp.send(listaTimes);
})



servidor.get('/modalidade', async (req, resp) => {
    let listaModalidades = await listarModalidades();
    resp.send(listaModalidades);
})

servidor.get('/categoria', async (req, resp) => {
    let listaCategorias = await listarCategorias();
    resp.send(listaCategorias);
})

servidor.get('/subcategoria', async (req, resp) => {
    let listaSubcategoria = await listarSubcategorias();
    resp.send(listaSubcategoria);
})

export default servidor;