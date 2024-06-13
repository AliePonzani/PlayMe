import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { buscarUsuario, listarModalidades, listarTimes, listarTimesQueParticipo, sairDoTime, salvar } from '../../API/chamadas';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [modalidades, setModalidades] = useState([]);
    const [times, setTimes] = useState([]);
    const [timesQueParticipo, setTimesQueParticipo] = useState([]);

    const logout = () => {
        localStorage.removeItem('token');
        setUsuario(null);
    };

    const listaTimes = async (id_time) => {
        const info = await listarTimesQueParticipo(id_time);
        setTimesQueParticipo(info);
    }

    const todosOsTimes = async () => {
        const times = await listarTimes();
        setTimes(times);
    }

    const sair = async (link, time) => {
        const resp = await sairDoTime(link, time);
        await listaTimes(usuario.id)
        return resp;
    }

    const entrarProTime = async (id_time, id_participante) => {
        const body = {
            usuario: id_participante,
            time: id_time
        };
        const resp = await salvar("participante", body);
        await todosOsTimes();
        return resp;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        let decoded = '';
        if (token) {
            decoded = jwtDecode(token);
        }
        const buscar = async () => {
            try {
                const info = await buscarUsuario(decoded.infoUsuario[0].id)
                setUsuario(info[0]);
                const modalidades = await listarModalidades();
                setModalidades(modalidades);
                await todosOsTimes();
                await listaTimes(decoded.infoUsuario[0].id);
            } catch (error) {
                console.log(error);
            }
        }
        buscar();
    }, []);

    return (
        <UserContext.Provider value={{ usuario, setUsuario, logout, modalidades, times, timesQueParticipo, sair, entrarProTime, setTimes }}>
            {children}
        </UserContext.Provider>
    );
};
