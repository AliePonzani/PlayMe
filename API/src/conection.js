import mysql from 'mysql2/promise';
import 'dotenv/config';

let con;

try {
  con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'playMe'
  });
  console.log('Conexão com BD realizada');
} catch (error) {
  console.error('Erro ao conectar ao banco de dados!', error.message);
}

export default con;