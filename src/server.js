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

const connectionString = 'postgresql://postgres:PeLD15VqkNmasJpb@db.aozfzfjykqvnjxgxkdnp.supabase.co:5432/postgres';


const pool = new Pool({
  connectionString,
});

pool.connect((err, client, release) => {
  if (err) 
  {
    return console.error('Erro ao conectar ao banco de dados:', err);
  }
  console.log('Conexão com o banco de dados Supabase estabelecida');
  release();
});

app.post('/projetos', async (req, res) => {
  const { projeto, serie, professor, descricao, dataInicio, dataFim } = req.body;

  console.log('Dados recebidos do formulário:', { projeto, serie, professor, descricao, dataInicio, dataFim });

  try 
  {
    await pool.query('BEGIN');

    const result = await pool.query(
      `INSERT INTO public.projetos_educacionais 
      (nome_projeto, serie, professor, descricao, data_inicio, data_fim) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [projeto, serie, professor, descricao, dataInicio, dataFim]
    );

    console.log('Dados salvos no banco de dados com sucesso:', result.rows[0]);

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Dados salvos com sucesso', data: result.rows[0] });
  } 
  catch (err)
  {
    await pool.query('ROLLBACK');
    console.error('Erro ao salvar os dados no banco de dados:', err);
    res.status(500).json({ error: 'Erro ao salvar os dados' });
  }
});

app.get('/projetos', async (req, res) => {
  try 
  {
    const result = await pool.query('SELECT * FROM public.projetos_educacionais ORDER BY id DESC');
    console.log('Dados consultados com sucesso:', result.rows);

    res.status(200).json({ data: result.rows });
  } 
  catch (err) 
  {
    console.error('Erro ao consultar os dados no banco de dados:', err);
    res.status(500).json({ error: 'Erro ao consultar os dados' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));