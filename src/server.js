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
  connectionString: 'postgresql://postgres.aozfzfjykqvnjxgxkdnp:PeLD15VqkNmasJpb@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000, // tempo máximo que uma conexão pode ficar inativa
  connectionTimeoutMillis: 5000, // tempo máximo para estabelecer conexão
  family: 4 // Força o uso de IPv4
});

// Adiciona listener para erros de conexão
pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexão:', err);
});

// Função para fechar o pool de conexões
const closePool = async () => {
  try {
    await pool.end();
    console.log('Pool de conexões fechado');
  } catch (err) {
    console.error('Erro ao fechar pool:', err);
  }
};

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
    const { projeto, serie, professor, descricao, dataInicio, dataFim } = req.body;
    
    // Validação dos campos obrigatórios
    if (!projeto || !serie || !professor || !descricao || !dataInicio || !dataFim) {
      return res.status(500).json({ 
        error: 'Todos os campos são obrigatórios' 
      });
    }

    client = await pool.connect();
    console.log('POST /projetos - Conexão obtida');
    console.log('Request body:', req.body);
    
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

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  // Gerenciamento de encerramento gracioso
  process.on('SIGTERM', () => {
    console.log('Recebido sinal SIGTERM. Iniciando encerramento gracioso...');
    server.close(async () => {
      console.log('Servidor HTTP fechado.');
      await closePool();
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('Recebido sinal SIGINT. Iniciando encerramento gracioso...');
    server.close(async () => {
      console.log('Servidor HTTP fechado.');
      await closePool();
      process.exit(0);
    });
  });
}

module.exports = app;