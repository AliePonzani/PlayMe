import Header from "../../Components/Header/Header";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { UserContext } from "../../Components/UserContext/UserContext";
import { useContext } from "react";
import './index.scss'
import { listarTimes } from "../../API/chamadas";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Times() {
    const { usuario, entrarProTime } = useContext(UserContext);
    const [times, setTimes] = useState([]);
    const location = useLocation();
    const { modalidadesComTime, modalidadeSelecionada } = location.state || {};
    const [selectedModalidade, setSelectedModalidade] = useState(modalidadeSelecionada);

    const handleChange = (event) => {
        setSelectedModalidade(event.target.value);
    };

    let filteredTimes = times;

    if (selectedModalidade !== 'all') {
        filteredTimes = times.filter(time =>
            time.modalidade.toLowerCase() === selectedModalidade.toLowerCase()
        );
    }

    const imagemModalidade = (modalidade) => {
        const imagem = modalidadesComTime.filter(
            info => info.modalidade.toLowerCase() === modalidade.toLowerCase()
        );
        return imagem[0].imagem;
    }

    const formatDate = (datetimeString) => {
        const datetime = new Date(datetimeString);
        const date = datetime.toLocaleDateString();
        const hora = datetime.toLocaleTimeString();
        return { date, hora };
    };

    const entrar = async (id_time, id_participante) => {
        if (id_participante) {
            try {
                const resp = await entrarProTime(id_time, id_participante);
                toast.success(resp.data);
            } catch (error) {
                toast.error(error.response.data);
            }
        } else {
            toast.error("Necessário realizar o login para entrar no time!");
        }
    };

    useEffect(() => {
        const buscarTimes = async () => {
            try {
                const times = await listarTimes();
                setTimes(times);
            } catch (error) {
                console.log(error);
            }
        }
        buscarTimes();
    }, [])

    return (
        <div >
            <ToastContainer />
            <Header />
            <div className="timesContainer">
                <div className="opcao">
                    <label>Lista de times na modalidade </label>
                    <FormControl sx={{ m: 1, minWidth: 200, height: '20px' }}>
                        <Select
                            value={selectedModalidade}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{ height: '30px' }}
                        >
                            <MenuItem value="all">
                                <em>Todos</em>
                            </MenuItem>
                            {modalidadesComTime.map(modalidade => (
                                <MenuItem key={modalidade.id} value={modalidade.modalidade}>{modalidade.modalidade}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="cardsTimes">
                    {filteredTimes.map((time) => (
                        <div className="cardTime" key={time.id}>
                            <img src={imagemModalidade(time.modalidade)} alt="imagem modalidade" />
                            <h1>{time.modalidade}</h1>
                            <div>Local: {time.endereco}</div>
                            <div>Data: {formatDate(time.data).date}</div>
                            <div>Hora: {formatDate(time.data).hora}</div>
                            <div>{time.informacoes}</div>
                            <div className="qtdJogadores">
                                <div>Qtd. de jogadores até o momento</div>
                                <div className="qtd">{time.participantes_atual}</div>
                                <div>Qtd. de vagas em aberto</div>
                                <div className="qtd">{time.max_participantes - time.participantes_atual}</div>
                                <button onClick={() => entrar(time.id, usuario ? usuario.id : null)}>Entrar pro time</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}