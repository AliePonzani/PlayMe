create database playMe;
use playMe;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    imagem VARCHAR(255)
);

CREATE TABLE time (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modalidade VARCHAR(100) NOT NULL,
    registrador_id INT NOT NULL,
    endereco varchar(250) NOT NULL,
    data datetime NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    informacoes varchar(500) NOT NULL,
    max_participantes INT NOT NULL,
    participantes_atual INT DEFAULT 0,
    FOREIGN KEY (registrador_id) REFERENCES usuario(id)
);

CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    time_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (time_id) REFERENCES time(id),
    UNIQUE (usuario_id, time_id)
);