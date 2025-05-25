# Cadastro de Projetos Educacionais

Sistema de API REST para gerenciamento de projetos educacionais, permitindo o cadastro e consulta de projetos escolares.

## 🚀 Tecnologias

- Node.js (v20+)
- Express.js
- PostgreSQL (via Supabase)
- Jest & Supertest (testes)

## 📋 Funcionalidades

- ✅ Cadastro de projetos educacionais (POST)
- ✅ Listagem de projetos (GET)
- ✅ Validação de dados
- ✅ Testes automatizados

## 🛠️ Estrutura do Projeto

```
├── src/
│   ├── server.js        # Arquivo principal do servidor
│   └── server.test.js   # Testes da API
├── package.json
└── README.md
```

## 🔧 Variáveis de Ambiente

```env
DATABASE_URL=sua_url_do_supabase
PORT=3000 (opcional)
NODE_OPTIONS=--dns-result-order=ipv4first
```

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start

# Executar testes
npm test
```

## 🔌 Endpoints da API

A API possui dois endpoints:

### 1. GET /projetos
Lista todos os projetos cadastrados.

**Exemplo de Requisição:**
```bash
GET /projetos
```

**Resposta (200 OK)**
```json
{
  "data": [
    {
      "id": 1,
      "nome_projeto": "Nome do Projeto",
      "serie": "9º Ano",
      "professor": "Nome do Professor",
      "descricao": "Descrição do projeto",
      "data_inicio": "2024-03-15",
      "data_fim": "2024-04-15",
      "created_at": "2024-03-15T12:00:00Z",
      "updated_at": null
    }
  ]
}
```

### 2. POST /projetos
Cadastra um novo projeto. Todos os campos são obrigatórios.

**Exemplo de Requisição:**
```bash
POST /projetos
Content-Type: application/json

{
  "projeto": "Nome do Projeto",
  "serie": "9º Ano",
  "professor": "Nome do Professor",
  "descricao": "Descrição do projeto",
  "dataInicio": "2024-03-15",
  "dataFim": "2024-04-15"
}
```

**Resposta (201 Created)**
```json
{
  "message": "Dados salvos com sucesso",
  "data": {
    "id": 1,
    "nome_projeto": "Nome do Projeto",
    "serie": "9º Ano",
    "professor": "Nome do Professor",
    "descricao": "Descrição do projeto",
    "data_inicio": "2024-03-15",
    "data_fim": "2024-04-15",
    "created_at": "2024-03-15T12:00:00Z",
    "updated_at": null
  }
}
```

**Resposta de Erro (500 Internal Server Error)**
```json
{
  "error": "Todos os campos são obrigatórios"
}
```

## 🚀 Deploy

O projeto está configurado para deploy no Railway.app. 

### Configuração no Railway:
1. Conecte seu repositório
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `NODE_OPTIONS=--dns-result-order=ipv4first`
3. O deploy será automático a cada push na branch principal

## 📝 Banco de Dados

O projeto utiliza PostgreSQL hospedado no Supabase. Abaixo estão todos os comandos SQL necessários para configurar o banco de dados:

### Criação da Tabela

```sql
CREATE TABLE public.projetos_educacionais (
    id SERIAL PRIMARY KEY,
    nome_projeto VARCHAR,
    serie VARCHAR,
    professor VARCHAR,
    descricao VARCHAR,
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

### Trigger para Atualização Automática

Este trigger atualiza automaticamente o campo `updated_at` sempre que um registro é modificado:

```sql
-- Função que será chamada pelo trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Criação do trigger
CREATE TRIGGER update_projetos_educacionais_updated_at
BEFORE UPDATE ON public.projetos_educacionais
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
```

### Consultas Úteis

```sql
-- Listar todos os projetos
SELECT * FROM public.projetos_educacionais;

-- Buscar projetos por série (case insensitive)
SELECT * FROM public.projetos_educacionais WHERE serie ILIKE '%%';

-- Buscar projetos por professor
SELECT * FROM public.projetos_educacionais WHERE professor ILIKE '%%';

-- Listar projetos ordenados por data de criação (mais recentes primeiro)
SELECT * FROM public.projetos_educacionais ORDER BY created_at DESC;

-- Listar projetos ativos (data_fim maior que hoje)
SELECT * FROM public.projetos_educacionais WHERE data_fim > NOW();
```

### Índices Recomendados

```sql
-- Índice para busca por série
CREATE INDEX idx_projetos_serie ON public.projetos_educacionais(serie);

-- Índice para busca por professor
CREATE INDEX idx_projetos_professor ON public.projetos_educacionais(professor);

-- Índice para ordenação por data
CREATE INDEX idx_projetos_data ON public.projetos_educacionais(data_inicio, data_fim);
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 