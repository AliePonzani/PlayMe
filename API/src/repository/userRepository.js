import con from "./conection.js";

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