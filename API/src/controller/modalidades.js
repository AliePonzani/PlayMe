import { Router } from "express";
import { promises as fs } from 'fs';

const servidor = Router();

async function getModalidades() {
    const data = await fs.readFile('./src/modalidades.json', 'utf-8');
    return JSON.parse(data);
}

servidor.get('/modalidade', async (req, resp) => {
    try {
        const modalidades = await getModalidades();
        resp.status(200).json(modalidades);
    } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
        resp.status(500).send({ erro: 'Erro interno do servidor.' });
    }
});

export default servidor;
