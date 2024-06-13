import axios from 'axios'

const API_Adress = 'http://127.0.0.1:5000/'

export async function buscarUsuarioLogin(body) {
    let url = API_Adress + 'login';
    let resp = await axios.post(url, body);
    return resp;
}

export async function buscarUsuario(id) {
    let url = API_Adress + `usuario/${id}`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function salvar(caminho, body) {
    let url = API_Adress + `${caminho}`;
    let resp = await axios.post(url, body);
    return resp;
}

export function buscarImagem(imagem) {
    const imagemCorrigida = imagem ? imagem.replace(/\\/g, '/') : '';
    let url = API_Adress + `${imagemCorrigida}`;
    return imagemCorrigida ? url : '';
}

export async function listarModalidades() {
    let url = API_Adress + `modalidade`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function listarTimes() {
    let url = API_Adress + `time`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function buscarTime(id) {
    let url = API_Adress + `time/${id}`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function listarTimesUsuario(id) {
    let url = API_Adress + `timesusuario/${id}`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function listarTimesQueParticipo(id) {
    let url = API_Adress + `participante/usuario/${id}`;
    let resp = await axios.get(url);
    return resp.data;
}

export async function sairDoTime(link, id) {
    let url = API_Adress + `${link}/${id}`;
    let resp = await axios.delete(url);
    return resp;
}

export async function alterarUsuario(id, body) {
    let url = API_Adress + `usuario/${id}`;
    let resp = await axios.put(url, body);
    return resp.data;
}

export async function alterarFoto( id, arquivoImagem) {
    let url = API_Adress + `usuario/imagem/${id}`
    const formData = new FormData();
    formData.append('imgUsuario', arquivoImagem);
    const uploadConfig = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    let resp = await axios.put(url, formData, uploadConfig);
    return resp.status;
}

export async function deletarUsuario(id) {
    let url = API_Adress + `usuario/${id}`;
    let resp = await axios.delete(url);
    return resp.data;
}




