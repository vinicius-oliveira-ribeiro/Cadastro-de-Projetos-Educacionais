const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

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
app.use(cors());

// Configuração do banco de dados
const pool = new Pool({
  user: 'postgres',
  password: 'PeLD15VqkNmasJpb',
  host: 'db.aozfzfjykqvnjxgxkdnp.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  family: 4,  // Força o uso de IPv4
  connectionTimeoutMillis: 5000, // Timeout de 5 segundos
  query_timeout: 10000 // Timeout de 10 segundos para queries
});

// Adiciona listener para erros de conexão
pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexão:', err);
});

// Função para testar a conexão
async function testarConexao() {
  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    const result = await client.query('SELECT NOW()');
    console.log('Teste de query executado com sucesso:', result.rows[0]);
    client.release();
    return true;
  } catch (err) {
    console.error('Erro ao testar conexão:', err);
    return false;
  }
}

// Rota de healthcheck
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testarConexao();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// Rota para listar projetos
app.get('/projetos', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    console.log('GET /projetos - Conexão obtida');
    
    const result = await client.query('SELECT * FROM public.projetos_educacionais ORDER BY id DESC');
    console.log(`GET /projetos - ${result.rowCount} registros encontrados`);
    
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Erro em GET /projetos:', err);
    res.status(500).json({ error: 'Erro ao consultar os dados' });
  } finally {
    if (client) {
      console.log('GET /projetos - Liberando conexão');
      client.release();
    }
  }
});

// Rota para criar projeto
app.post('/projetos', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    console.log('POST /projetos - Conexão obtida');
    console.log('Request body:', req.body);
    
    const { projeto, serie, professor, descricao, dataInicio, dataFim } = req.body;
    
    const result = await client.query(
      `INSERT INTO public.projetos_educacionais 
      (nome_projeto, serie, professor, descricao, data_inicio, data_fim) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [projeto, serie, professor, descricao, dataInicio, dataFim]
    );

    console.log('Projeto criado:', result.rows[0]);
    res.status(201).json({ message: 'Dados salvos com sucesso', data: result.rows[0] });
  } catch (err) {
    console.error('Erro em POST /projetos:', err);
    res.status(500).json({ error: 'Erro ao salvar os dados' });
  } finally {
    if (client) {
      console.log('POST /projetos - Liberando conexão');
      client.release();
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Testa a conexão assim que o servidor iniciar
  testarConexao();
});