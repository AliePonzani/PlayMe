import './index.scss';
import { MdEdit } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { UserContext } from "../../Components/UserContext/UserContext";
import { useContext, useEffect, useState } from "react";
import { alterarFoto, alterarUsuario, buscarImagem, buscarUsuario, deletarUsuario } from "../../API/chamadas";
import { Button, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function MinhaConta(params) {
    const navigate = useNavigate();
    const { usuario, logout, setUsuario } = useContext(UserContext);
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [imagemAlterada, setImagemAlterada] = useState(0);
    const [editMode, setEditMode] = useState({
        nome: false,
        email: false,
        senha: false,
        imagem: false
    });
    const [initialUserData, setInitialUserData] = useState({
        id: '',
        nome: '',
        email: '',
        senha: '',
        imagem: null
    });
    const [userData, setUserData] = useState({});
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleEditClick = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: false }));

    };

    const handleCancel = () => {
        setUserData(initialUserData);
        setEditMode({
            nome: false,
            email: false,
            senha: false,
            imagem: false
        });
    };

    const handleFileChange = (event) => {
        setImagemAlterada(imagemAlterada + 1);
        const file = event.target.files[0];
        if (file) {
            setArquivoImagem(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData((prev) => ({ ...prev, imagem: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            console.log("Nenhum arquivo inserido!");
        }
    };


    const atualizarUsuario = async () => {
        if (!userData.nome || !userData.email || !userData.senha || !userData.imagem) {
            alert("Todos os campos devem ser preenchidos");
            return;
        }
        try {
            const body = {
                nome: userData.nome,
                email: userData.email,
                senha: userData.senha
            }

            if (imagemAlterada > 0) {
                await alterarFoto(userData.id, arquivoImagem);
            }
            await alterarUsuario(userData.id, body);
            const usuarioAtualizado = await buscarUsuario(userData.id);
            const updatedUser = usuarioAtualizado[0];
            setUsuario((prevUsuario) => ({
                ...prevUsuario,
                infoUsuario: [updatedUser]
            }));
            toast.success("Usuário alterado com sucesso!");
        } catch (error) {
            toast.error("Erro ao realizar alteração!");
        }
    };

    const deletar = () => {
        try {
            deletarUsuario(userData.id);
            toast.success("Conta excluida com sucesso!");
            logout();
            navigate("/");
        } catch (error) {
            toast.error("Erro ao excluir conta!");
        }
    }

    useEffect(() => {
        if (usuario && usuario.nome) {
            const urlImagem = buscarImagem(usuario.imagem)
            const dados = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                imagem: urlImagem
            };
            setUserData(dados);
            setInitialUserData(dados);
        }
    }, [usuario])

    return (
        <div className="MinhaConta">
            <ToastContainer />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title">Atenção!!!</h2>
                    <p id="child-modal-description">
                        Deseja realmente excluir sua conta?
                    </p>
                    <Button onClick={deletar}>Excluir</Button>
                    <Button onClick={handleClose}>Cancelar</Button>
                </Box>
            </Modal>

            <div className="fotoUser">
                {userData.imagem ?
                    <div className="imagem" style={{border:'none'}}><img src={userData.imagem} alt="" /></div> :
                    <div className="imagem"><FaUser className='icon_arquivo' /></div>
                }
                <label className='editar'>
                    <input type="file" style={{ display: 'none', cursor: 'pointer' }} onChange={handleFileChange} />
                    <MdEdit />
                </label>
            </div>
            <div className='campo'>
                {editMode.nome ? (
                    <input
                        type='text'
                        name='nome'
                        value={userData.nome}
                        onChange={handleChange}
                        onBlur={() => handleBlur('nome')}
                    />
                ) : (
                    <>
                        Nome: <p>{userData.nome}</p>
                        <MdEdit onClick={() => handleEditClick('nome')} />
                    </>
                )}
            </div>
            <div className='campo'>
                {editMode.email ? (
                    <input
                        type='text'
                        name='email'
                        value={userData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                    />

                ) : (
                    <>
                        E-mail: <p>{userData.email}</p>
                        <MdEdit onClick={() => handleEditClick('email')} />
                    </>
                )}
            </div>
            <div className='campo'>
                {editMode.senha ? (
                    <input
                        type='text'
                        name='senha'
                        value={userData.senha}
                        onChange={handleChange}
                        onBlur={() => handleBlur('senha')}
                    />

                ) : (
                    <>
                        Senha: <p>{userData.senha}</p>
                        <MdEdit onClick={() => handleEditClick('senha')} />
                    </>
                )}
            </div>
            <div className='funcoes'>
                <Button variant="contained" color="success" onClick={atualizarUsuario}>Salvar</Button>
                <Button variant="contained" color="error" onClick={handleOpen}>Excluir Conta</Button>
                <Button variant="contained" color="error" onClick={handleCancel}>Cancelar</Button>
            </div>
        </div>
    )
}