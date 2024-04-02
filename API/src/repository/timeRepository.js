import con from "./conection.js";

export async function novoTime(time) {
    let comando = `
        insert into CriarTime (
            IdUsuario, 
            modalidade, 
            categoria, 
            subcategoria, 
            idadeMin, 
            idadeMax, 
            local, 
            dataJogo, 
            horaJogo, 
            qtdJogadores)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

    let resp = await con.query(comando, [time.idUsuario, time.modalidade, time.categoria, time.subcategoria, time.idadeMin, time.idadeMax, time.local, time.dataJogo, time.horaJogo, time.qtdJogadores])
    let info = resp[0];

    time.id = info.insertId;
    return time;
}

export async function listarTimes() {
    let comando = `
    SELECT 
        c.IdTime,
        u.nomeUser AS Criado_Por,
        m.nomeModalidade AS Modalidade,
        cat.nomeCategoria AS Categoria,
        sub.nomeSubcategoria AS Subcategoria,
        c.idadeMin,
        c.idadeMax,
        c.local,
        DATE_FORMAT(c.dataJogo, '%d/%m/%Y') AS dataJogo,
        c.horaJogo,
        c.qtdJogadores
    FROM 
        CriarTime c
    JOIN 
        Usuario u ON c.IdUsuario = u.Id
    JOIN 
        Modalidade m ON c.modalidade = m.IdModalidade
    JOIN 
        Categoria cat ON c.categoria = cat.idCategoria
    JOIN 
        Subcategoria sub ON c.subcategoria = sub.idSubcategoria;
    `

    let resp = await con.query(comando, []);
    let linhas = resp[0];

    return linhas;
}

export async function deletarTime(id, time) {
    try {
        let comando = `DELETE FROM CriarTime WHERE idTime = ?`
        let resp = await con.query(comando, [id]);
        if (resp[0].affectedRows !== 1) {
          throw new Error('Erro ao deletar time!');
        }
        return time;
      } catch (error) {
        throw error;
      }
}

export async function listarModalidades() {
    let comando = `
    SELECT * FROM modalidade
    `

    let resp = await con.query(comando, []);
    let linhas = resp[0];

    return linhas;
}

export async function listarCategorias() {
    let comando = `
    SELECT * FROM categoria
    `

    let resp = await con.query(comando, []);
    let linhas = resp[0];

    return linhas;
}

export async function listarSubcategorias() {
    let comando = `
    SELECT * FROM subcategoria
    `

    let resp = await con.query(comando, []);
    let linhas = resp[0];

    return linhas;
}