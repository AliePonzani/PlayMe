import { useEffect, useContext, useState } from "react";
import { buscarTime } from "../../API/chamadas";
import { UserContext } from "../UserContext/UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CardTime(params) {
    const [time, setTime] = useState([]);
    const { modalidades, sair } = useContext(UserContext);

    useEffect(() => {
        const buscar = async () => {
            const resultado = await buscarTime(params.time_id);
            const time = resultado[0];
            setTime(time);
        }
        buscar();
    }, [params.time_id])

    const imagemModalidade = (modalidade) => {
        if (!modalidade) {
            return '';
        }
        const imagem = modalidades.filter(
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

    const handleEncerrarPartida = async () => {
        try {
            const resp = await sair(params.tipo, params.id);
            toast.success(resp.data);
        } catch (error) {
            console.error(error.data);
            toast.error(error.data);
        }
    };

    return (
        <div className="time" key={time.id}>
            <div className="imgLegenda">
                <div className="imagem">
                    <img src={imagemModalidade(time.modalidade)} alt="" />
                </div>
                <p>{time.modalidade}</p>
            </div>
            <div className="informacoes">
                <p>Local: {time.endereco}</p>
                <p>Data e Hora: {formatDate(time.data).date} ás {formatDate(time.data).hora}</p>
                <p>Categoria: {time.categoria}</p>
                <div className="qtdJogadores">
                    <p>Qtd. de jogadores até o momento</p>
                    <p className="qtd">{time.participantes_atual}</p>
                    <p>Qtd. de vagas em aberto</p>
                    <p className="qtd">{time.max_participantes - time.participantes_atual}</p>
                </div>
            </div>
            <button onClick={handleEncerrarPartida}>{params.tipo === 'time' ? 'Encerrar Partida': 'Sair do Time'}</button>
        </div>
    );
}