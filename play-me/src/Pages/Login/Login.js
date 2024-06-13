import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, Modal } from '@mui/material';
import './index.scss';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from '../../Components/UserContext/UserContext';
import { buscarUsuario, buscarUsuarioLogin, salvar } from '../../API/chamadas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [msg, setMsg] = useState("");
    const [formularioNome, setFormularioNome] = useState("");
    const [formularioEmail, setFormularioEmail] = useState("");
    const [formularioSenha, setFormularioSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openChildrenModal, setOpenChildrenModal] = useState(false);
    const navigate = useNavigate();
    const { setUsuario } = useContext(UserContext);

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenChildrenModal = () => {
        setOpenChildrenModal(true);
    };
    const handleCloseChildrenModal = () => {
        setOpenChildrenModal(false);
    };

    const handleCampos = (event, campo) => {
        const valor = event.target.value;
        if (campo === "email") {
            setEmail(valor);
        } else if (campo === "senha") {
            setSenha(valor);
        } else if (campo === "formularioNome") {
            setFormularioNome(valor);
        } else if (campo === "formularioEmail") {
            setFormularioEmail(valor);
        } else if (campo === "formularioSenha") {
            setFormularioSenha(valor);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await buscarUsuarioLogin({ email: email, senha: senha });
            console.log(response);
            const { token } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                const decoded = jwtDecode(token);
                const info = await buscarUsuario(decoded.infoUsuario[0].id)
                setUsuario(info[0]);
                navigate("/PaginaUsuario");
                console.log('Login bem-sucedido');
            }
        } catch (error) {
            setMsg("Usuário ou senha inválido!");
            console.error('Erro ao fazer login', error);
        }
    };

    const handleFormulario = (event) => {
        event.preventDefault();
        handleOpenChildrenModal();
    }

    const cadastrarUsuario = async () => {
        try {
            const body = {
                nome: formularioNome,
                email: formularioEmail,
                senha: formularioSenha
            };
            await salvar("usuario", body);
            toast.success("Usuário cadastrado com sucesso!");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error("E-mail já cadastrado!");
            } else {
                toast.error("Erro ao cadastrar usuário. Tente novamente.");
                console.log('Erro ao cadastrar usuário' + error);
            }
        }
        handleCloseChildrenModal();
        handleCloseModal();
    };

    return (
        <div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="parent-modal-title">Insira seus dados</h2>
                    <form onSubmit={handleFormulario}>
                        <div>
                            <label htmlFor='nome'>Nome Completo: </label>
                            <input type='text' id='nome' onChange={(e) => handleCampos(e, "formularioNome")} />
                        </div>
                        <div>
                            <label htmlFor='email'>E-mail: </label>
                            <input type='email' id='email' onChange={(e) => handleCampos(e, "formularioEmail")} />
                        </div>
                        <div>
                            <label htmlFor='senha'>Senha: </label>
                            <input type='password' id='senha' onChange={(e) => handleCampos(e, "formularioSenha")} />
                        </div>
                        <Button type='submit'>Cadastrar</Button>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                    </form>
                </Box>
            </Modal>
            <Modal
                open={openChildrenModal}
                onClose={handleCloseModal}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="child-modal-title">Atenção</h2>
                    <p id="child-modal-description">
                        Confira os campo que estão sendo cadastrados e clique em CADASTRAR
                    </p>
                    <p>
                        Nome completo: {formularioNome}
                    </p>
                    <p>
                        E-mail: {formularioEmail}
                    </p>
                    <p>
                        Senha: {formularioSenha}
                    </p>
                    <Button onClick={cadastrarUsuario}>cadastrar</Button>
                    <Button onClick={handleCloseChildrenModal}>Cancelar</Button>
                </Box>
            </Modal>

            <div className='login'>
                <img src="/assets/img/Logo.png" alt="logo" />
                <Box
                    className='formulario'
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <TextField id="outlined-basic" label="E-mail" variant="outlined" value={email} onChange={(e) => handleCampos(e, "email")} />
                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={senha}
                            onChange={(e) => handleCampos(e, "senha")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Senha"
                        />
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary">
                        Entrar
                    </Button>
                    <p>{msg}</p>
                    <button className='cadastrar' onClick={handleOpenModal}>Cadastrar</button>
                    <ToastContainer />
                </Box>
            </div>
        </div>
    );
}