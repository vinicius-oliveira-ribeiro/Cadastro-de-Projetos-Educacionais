const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});


pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados:', err);
  }
  console.log('Conexão com o banco de dados estabelecida');
  release();
});

app.post('/projetos', async (req, res) => {
   const { projeto, serie, professor, descricao } = req.body;
   console.log('Dados recebidos do formulário:', projeto, serie, professor, descricao);
   try {
       
       await pool.query('BEGIN');
       
       const result = await pool.query(
           `INSERT INTO public.projetos_educacionais (nome_projeto, serie, professor, descricao) VALUES ($1, $2, $3, $4) RETURNING *`,
           [projeto, serie, professor, descricao]
       );
       console.log('Dados salvos no banco de dados com sucesso:', result.rows[0]);
       
       await pool.query('COMMIT');
       res.status(201).json({ message: 'Dados salvos com sucesso', data: result.rows[0] });
   } catch (err) {
       await pool.query('ROLLBACK');
       console.error('Erro ao salvar os dados no banco de dados:', err);
       res.status(500).json({ error: 'Erro ao salvar os dados' });
   }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));