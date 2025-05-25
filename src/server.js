const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  next();
});

// Configuração básica
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Permitir apenas origens específicas
  if (origin === 'http://127.0.0.1:5500' || origin === 'http://localhost:5500') {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Max-Age', '86400'); // 24 horas
  }

  // Preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(204).end();
  }

  next();
});

// Configuração do banco de dados
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:PeLD15VqkNmasJpb@db.aozfzfjykqvnjxgxkdnp.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  // Configurações adicionais para melhorar a conectividade
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  application_name: 'cadastro_projetos',
  // Forçar IPv4
  host: 'db.aozfzfjykqvnjxgxkdnp.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'PeLD15VqkNmasJpb',
  database: 'postgres'
});

// Adicionar mais logging para debug
pool.on('connect', () => {
  console.log('Nova conexão estabelecida com o banco de dados');
});

pool.on('acquire', () => {
  console.log('Conexão obtida do pool');
});

pool.on('remove', () => {
  console.log('Conexão removida do pool');
});

// Evento de erro na pool
pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
});

// Teste de conexão com retry
async function conectarBancoDados(tentativas = 5) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const client = await pool.connect();
      console.log('Conexão com o banco de dados Supabase estabelecida');
      client.release();
      return true;
    } catch (err) {
      console.error(`Tentativa ${i + 1} de ${tentativas} falhou:`, err);
      if (i === tentativas - 1) {
        console.error('Todas as tentativas de conexão falharam');
        throw err;
      }
      // Espera 5 segundos antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Inicia a conexão
conectarBancoDados().catch(err => {
  console.error('Erro final ao conectar ao banco de dados:', err);
});

// Rota de teste
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'API está funcionando!' });
});

// Rota para listar projetos
app.get('/projetos', async (req, res) => {
  try {
    console.log('GET /projetos route hit');
    const result = await pool.query('SELECT * FROM public.projetos_educacionais ORDER BY id DESC');
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Erro ao consultar os dados:', err);
    res.status(500).json({ error: 'Erro ao consultar os dados' });
  }
});

// Rota para criar projeto
app.post('/projetos', async (req, res) => {
  try {
    console.log('POST /projetos route hit');
    console.log('Request body:', req.body);
    
    const { projeto, serie, professor, descricao, dataInicio, dataFim } = req.body;
    
    const result = await pool.query(
      `INSERT INTO public.projetos_educacionais 
      (nome_projeto, serie, professor, descricao, data_inicio, data_fim) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [projeto, serie, professor, descricao, dataInicio, dataFim]
    );

    console.log('Projeto criado:', result.rows[0]);
    res.status(201).json({ message: 'Dados salvos com sucesso', data: result.rows[0] });
  } catch (err) {
    console.error('Erro ao salvar os dados:', err);
    res.status(500).json({ error: 'Erro ao salvar os dados' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));