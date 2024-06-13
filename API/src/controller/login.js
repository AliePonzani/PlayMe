import { Router } from "express";
import jwt from 'jsonwebtoken';
import { buscarUsuarioLogin } from "../repository/userRepository.js";
const servidor = Router();

const SECRET_KEY = 'your_secret_key';

servidor.post('/login', async (req, resp) => {
    const {email, senha} = req.body;
    const infoUsuario = await buscarUsuarioLogin(email);
    if (infoUsuario.length > 0) {
        if (email === infoUsuario[0].email && senha === infoUsuario[0].senha) {
            const token = jwt.sign( {infoUsuario} , SECRET_KEY, { expiresIn: '1h' });
            resp.status(200).json({ token });
        } else {
            resp.status(500).json({ message: 'Credenciais inválidas' });
        }
    } else{
        resp.status(500).json({ message: 'Credenciais inválidas' });
    }
});

export default servidor;