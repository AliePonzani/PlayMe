import { UserContext } from "../../Components/UserContext/UserContext";
import { useContext, useEffect, useState } from "react";
import Header from '../../Components/Header/Header';
import { listarTimesUsuario } from "../../API/chamadas";
import './index.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CardTime from "../../Components/CardTime/CardTime";

export default function PaginaUsuario() {
    const { usuario, timesQueParticipo } = useContext(UserContext);
    const [meusTimes, setMeusTimes] = useState([]);


    useEffect(() => {
        const timesCriados = async () => {
            const idUsuario = usuario.id;
            const resultadoTimes = await listarTimesUsuario(idUsuario);
            setMeusTimes(resultadoTimes);
        }
        timesCriados();
    }, [timesQueParticipo, usuario.id, usuario.infoUsuario])

    return (
        <div>
            <ToastContainer />
            <Header />
            <div className="paginaUsuario">
                <section>
                    <h1>Meus Times</h1>
                    <div className="meusTimes">
                        {meusTimes && meusTimes.length > 0 ? (
                            meusTimes.map((time) =>
                                <CardTime time_id={time.id} id={time.id} tipo='time'></CardTime>
                            )
                        ) : (
                            <div>Nenhum time encontrado</div>
                        )
                        }
                    </div>
                </section>
                <section>
                    <h1>Times que entrei</h1>
                    <div className="meusTimes">
                        {timesQueParticipo && timesQueParticipo.length > 0 ? (
                            timesQueParticipo.map((time) =>
                                <CardTime time_id={time.time_id} id={time.id} tipo='participante'></CardTime>
                            )
                        ) : (
                            <div>Você não participa de nenhum time ainda!!</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}