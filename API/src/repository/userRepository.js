import con from "./conection.js";

export async function exibirUsuarios() {
  try {
    let comando = `select * from Usuario`

    let resp = await con.query(comando, []);
    let linhas = resp[0];

    return linhas;
  } catch (error) {
    throw error;
  }
}

export async function exibirUsuario(id) {
  try {
    let comando = `select * from Usuario WHERE id = ?`

    let resp = await con.query(comando, [id]);
    let linhas = resp[0];

    return linhas;
  } catch (error) {
    throw error;
  }
}

export async function novoUsuario(usuario) {
  let comando = `
      insert into Usuario (nomeUser, email, sexo, dataNasc) 
                    values (?, ?, ?, ?)
    `

  let resp = await con.query(comando, [usuario.nomeUser, usuario.email, usuario.sexo, usuario.dataNasc])
  let info = resp[0];

  usuario.id = info.insertId;
  return usuario;
}

export async function alterarUsuario(id, usuario) {
  try {
    let comando = `
      UPDATE usuario SET
      nomeUser = ?,
      email = ?,
      sexo = ?,
      dataNasc = ?
      WHERE Id = ?
    `;

    const [rows, fields] = await con.query(comando, [
      usuario.nomeUser,
      usuario.email,
      usuario.sexo,
      usuario.dataNasc,
      id
    ]);

    if (rows.affectedRows !== 1) {
      throw new Error('Usuário não encontrado ou não atualizado');
    }

    return usuario;
  } catch (error) {
    throw error;
  }
}

export async function deletarUsuario(id, usuario) {
  try {
    let comando = `DELETE FROM usuario WHERE id = ?`
    let resp = await con.query(comando, [id]);
    if (resp[0].affectedRows !== 1) {
      throw new Error('Erro ao deletar usuário!');
    }
    return usuario;
  } catch (error) {
    throw error;
  }
}

export async function listarTimesUsuario(id) {
  try {
    let comando = `SELECT idTime from CriarTime WHERE idUsuario = ?`
    let resp = await con.query(comando, [id]);
    let linhas = resp[0];

    return linhas;
  } catch (error) {
    throw error;
  }
}