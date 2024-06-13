import './landingPage.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { UserContext } from '../../Components/UserContext/UserContext';
import { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import { listarModalidades, listarTimes, salvar } from '../../API/chamadas';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function LandingPage() {
    const { usuario } = useContext(UserContext);
    const categorias = [
        'Iniciante - Feminino',
        'Iniciante - Masculino',
        'Iniciante - Infantil',
        'Intermediario - Feminino',
        'Intermediario - Masculino',
        'Intermediario - Infantil',
        'Profissional - Feminino',
        'Profissional - Masculino',
        'Profissional - Infantil'
    ]
    const [modalidades, setModalidades] = useState([]);
    const [modalidadesComTime, setModalidadesComTime] = useState([]);
    const navigate = useNavigate();

    const [dadosFormulario, setDadosFormulario] = useState({
        modalidade: '',
        registrador: '',
        endereco: '',
        data: '',
        categoria: '',
        informacoes: '',
        hora: '',
        max_participantes: '',
        participantes_atual: 1
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosFormulario({
            ...dadosFormulario,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usuario && usuario.id) {
            const verificarCampos = (formData) => {
                return Object.values(formData).every(value => value !== null && value !== undefined && value !== '');
            };
            if (!verificarCampos(dadosFormulario)) {
                toast.error("Todos os campos devem ser preenchidos!");
                return;
            } else {
                try {
                    const data = `${dadosFormulario.data} ${dadosFormulario.hora}:00`
                    delete dadosFormulario.hora;
                    const body = {
                        ...dadosFormulario,
                        registrador: usuario.id,
                        data: data
                    };
                    await salvar('time', body);
                    setDadosFormulario({
                        modalidade: '',
                        registrador: '',
                        endereco: '',
                        data: '',
                        categoria: '',
                        informacoes: '',
                        hora: '',
                        max_participantes: '',
                        participantes_atual: 1
                    });
                    toast.success('Time criado com sucesso!');
                } catch (error) {
                    toast.error("Erro ao criar time!");
                }
            }
        } else {
            toast.error("Necessário realizar login para criar um time!");
        }
    };

    const handleNavigation = (modalidadeSelecionada) => {
        navigate('/Times', { state: { modalidadesComTime, modalidadeSelecionada } });
    };

    useEffect(() => {
        const buscarModalidades = async () => {
            try {
                const modalidades = await listarModalidades();
                const times = await listarTimes();
                const modalidadesComTime = modalidades.filter(modalidade =>
                    times.some(time => time.modalidade.toLowerCase() === modalidade.modalidade.toLowerCase())
                );
                setModalidades(modalidades);
                setModalidadesComTime(modalidadesComTime);
            } catch (error) {
                console.log(error);
            }
        }
        buscarModalidades();
    }, [usuario])


    return (
        <div className="LandingPage">
            <ToastContainer />
            <Header />
            <section className="container">
                <div className="sessoes">
                    <a href="#times">times</a>
                    <a href="#meuTime">meu time</a>
                    <a href="#sobre">sobre</a>
                </div>
            </section>
            <section className="times" id="times">
                <h1>times</h1>
                <p className="descricao">
                    Nesta seção, descubra uma lista completa de times procurando jogadores para eventos esportivos locais. Explore diferentes esportes próximos a você, com detalhes como enderecoização, data, hora, nível de habilidade e número de participantes necessários. Inscreva-se em um time e aguarde a confirmação para desfrutar de uma partida emocionante com outros entusiastas do esporte!
                </p>
                <div className="cardsTimes">
                    {modalidadesComTime.map((modalidade) => (
                        <div className="cardTime" onClick={() => handleNavigation(modalidade.modalidade)} key={modalidade.id} >
                            <div className="imagemModalidade">
                                <img src={modalidade.imagem} alt={`Modalidade ${modalidade.modalidade}`} />
                            </div>
                            <p>{modalidade.modalidade}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="meuTime" id="meuTime">
                <h1>Meu Time</h1>
                <div className="conteudo">
                    <div>
                        <p>
                            Não achou um time para fazer parte? Não tem problema!
                        </p>
                        <p>Com a função MEU TIME, você pode começar o seu próprio. É como ser o capitão do seu próprio navio esportivo! Escolha o esporte, o endereco, categoria, a data e a hora do evento, e convide outros jogadores para se juntarem a você. É uma ótima maneira de organizar jogos com amigos ou conhecer novas pessoas que compartilham do mesmo interesse pelo esporte. Então, não perca tempo, crie o sua própria equipe e seja o líder da jogada!</p>
                    </div>
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="opcao">
                            <label>Modalidade: </label>
                            <Select
                                name="modalidade"
                                value={dadosFormulario.modalidade}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{ height: '30px' }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {modalidades.map(modalidade => (
                                    <MenuItem key={modalidade.id} value={modalidade.modalidade}>{modalidade.modalidade}</MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="opcao">
                            <label>Categoria: </label>
                            <Select
                                name="categoria"
                                value={dadosFormulario.categoria}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{ height: '30px' }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {categorias.map((categoria, item) => (
                                    <MenuItem key={item} value={categoria}>{categoria}</MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="opcao">
                            <label>Endereço da partida:</label>
                            <input
                                type='text'
                                name="endereco"
                                value={dadosFormulario.endereco}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="opcao">
                            <label>Data:</label>
                            <input
                                type="date"
                                name="data"
                                value={dadosFormulario.data}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="opcao">
                            <label>Hora:</label>
                            <input
                                type="time"
                                name="hora"
                                value={dadosFormulario.hora}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="opcao">
                            <label>Quantidade de jogadores:</label>
                            <input
                                type="number"
                                placeholder="0"
                                name="max_participantes"
                                value={dadosFormulario.max_participantes}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="opcao">
                            <label>Informações:</label>
                            <textarea
                                rows="5"
                                placeholder="Inserir informações como se o endereco é coberto, se vai existir cobranças, existe uma idade permitida."
                                name="informacoes"
                                value={dadosFormulario.informacoes}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit">Criar Time</button>
                    </form>
                </div>
            </section>
            <section className="sobre" id="sobre">
                <h1>Sobre</h1>
                <p>
                    Bem-vindo ao nosso site dedicado a conectar entusiastas de esportes! Nosso principal objetivo é proporcionar uma plataforma fácil e eficiente para que pessoas de todas as habilidades e interesses possam se reunir e praticar esportes juntas. Quer você esteja procurando por uma partida casual de futebol com amigos ou ansioso por competições mais sérias, nosso site é o lugar perfeito para você.
                </p>
                <p>
                    Aqui, você encontrará uma variedade de recursos projetados para facilitar a organização de eventos esportivos. Desde a criação de novos times até a busca por jogadores para preencher sua equipe, nosso site oferece todas as ferramentas necessárias para que você possa encontrar e participar de atividades esportivas de forma simples e conveniente.
                </p>
                <p>
                    Nosso objetivo é promover a atividade física, o espírito de equipe e a diversão através do esporte. Acreditamos que todos devem ter a oportunidade de se envolver em atividades esportivas, independentemente de sua habilidade ou experiência prévia. Portanto, estamos comprometidos em criar uma comunidade inclusiva e acolhedora, onde todos se sintam bem-vindos e capacitados a participar.
                </p>
                <p>
                    Ao unir pessoas apaixonadas por esportes, esperamos não apenas promover um estilo de vida ativo e saudável, mas também cultivar amizades duradouras e memórias inesquecíveis. Estamos entusiasmados por você se juntar a nós nesta jornada emocionante de camaradagem e competição saudável. Vamos jogar juntos e fazer deste site o ponto de encontro definitivo para todos os amantes de esportes!
                </p>
            </section>
        </div>
    )
}