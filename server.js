const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware para parsear o corpo das requisições JSON

// Configuração da conexão com o banco de dados
const pool = new Pool({
 host: process.env.PGHOST,
 database: process.env.PGDATABASE,
 user: process.env.PGUSER,
 password: process.env.PGPASSWORD,
 port: 5432,
 ssl: {
    rejectUnauthorized: false
 }
});

// Rota para adicionar um novo projeto
app.post('/projetos', async (req, res) => {
 const { nome_projeto, serie, professor, descricao } = req.body;

 try {
    const result = await pool.query(
      'INSERT INTO projetos_educacionais (nome_projeto, serie, professor, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome_projeto, serie, professor, descricao]
    );

    res.status(201).json(result.rows[0]);
 } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar projeto' });
 }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));