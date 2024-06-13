import { LuLogIn } from "react-icons/lu";
import './index.scss';
import { UserContext } from "../UserContext/UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buscarImagem } from "../../API/chamadas";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

export default function Header() {
    const { usuario, logout } = useContext(UserContext);
    const [primeiroNome, setPrimeiroNome] = useState('');
    const [caminhoImagem, setCaminhoImagem] = useState(null);
    const pagina = useLocation();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const minhaConta = () => {
        navigate("/MinhaConta");
    }

    const handleLogout = () => {
        logout();
        voltarHome();
    }
    
    const voltarHome = () => {
        navigate("/");
    };

    useEffect(() => {
        if (usuario && usuario.nome) {
            const nomeCompleto = usuario.nome;
            const primeiroNome = nomeCompleto.split(' ')[0];
            setPrimeiroNome(primeiroNome);
        }
        if (usuario && usuario.imagem) {
            setCaminhoImagem(usuario.imagem)
        }
    }, [usuario])

    return (
        <header>
            <img src="/assets/img/Logo.png" alt="teste" onClick={voltarHome}/>
            <div className="login">
                {caminhoImagem ?
                    <div className="imagem"><img src={buscarImagem(caminhoImagem)} alt="" /></div> :
                    <LuLogIn />
                }
                {pagina.pathname === '/PaginaUsuario' ? 
                <button className="menu" onClick={handleClick}>{primeiroNome}</button> :
                <Link className="menu" to={usuario ? "/PaginaUsuario" : "/Login"}>{usuario ? primeiroNome : 'Login'}</Link>
            }
            </div>


            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={minhaConta}>
                    <Avatar /> Minha Conta
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </header>
    );
}
