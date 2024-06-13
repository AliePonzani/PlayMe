import con from "../conection.js";

export async function exibirUsuarios() {
  try {
    let comando = `select * from usuario`

    let resp = await con.query(comando, []);
    let linhas = resp[0];

    return linhas;
  } catch (error) {
    throw error;
  }
}

export async function exibirUsuario(id) {
  try {
    let comando = `select * from usuario WHERE id = ?`
    let resp = await con.query(comando, [id]);
    let linhas = resp[0];
    return linhas;
  } catch (error) {
    throw error;
  }
}

export async function buscarUsuarioLogin(email) {
  try {
    let comando = `select * from usuario WHERE email = ?`
    let resp = await con.query(comando, [email]);
    let linhas = resp[0];
    return linhas;
  } catch (error) {
    throw error;
  }
}

export async function novoUsuario(usuario) {
  try {
    let comando = `insert into usuario (nome, email, senha) values (?, ?, ?)`
    let [resp] = await con.query(comando, [usuario.nome, usuario.email, usuario.senha])
    usuario.id = resp.insertId;
    return usuario;
  } catch (error) {
    if (error.errno === 1062) {
      throw new Error('EMAIL_JA_EXISTE');
    }
    throw error;
  }
}

export async function alterarUsuario(id, usuario) {
  try {
    let comando = `
      UPDATE usuario SET
      nome = ?,
      email = ?,
      senha = ?
      WHERE id = ?
    `;

    const [info] = await con.query(comando, [
      usuario.nome,
      usuario.email,
      usuario.senha,
      id
    ]);

    if (info.affectedRows !== 1) {
      throw new Error('Usuário não encontrado ou não atualizado');
    }

    return usuario;
  } catch (error) {
    throw error;
  }
}

export async function deletarUsuario(id) {
  console.log('entrou em deletarUsuario');
  try {
    let comando = `DELETE FROM usuario WHERE id = ?`
    let resp = await con.query(comando, [id]);
    if (resp[0].affectedRows === 0) {
      throw new Error('Erro ao deletar usuário!');
    }
    console.log(resp[0]);
    return resp[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function listarTimesUsuario(id) {
  try {
    let comando = `SELECT * from time WHERE registrador_id = ?`
    let resp = await con.query(comando, [id]);
    let linhas = resp[0];

    return linhas;
  } catch (error) {
    throw error;
  }
}

export async function alterarImagem(id, caminho) {
  try {
    let comando = `update usuario set imagem = ? where id = ?;`
    let [resp] = await con.query(comando, [caminho, id]);
    if (resp.affectedRows !== 1) {
      throw new Error('Usuário não encontrado ou não atualizado');
    }
    return resp.affectedRows;
  } catch (error) {
    throw error;
  }
}