const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear o corpo das requisições JSON
app.use(bodyParser.json());

// Classe Projeto e Cadastro permanecem as mesmas
// Aqui você deve definir a lógica de negócios para adicionar, remover e buscar projetos

// Rota para adicionar um projeto
app.post('/projetos', (req, res) => {
    const projeto = req.body; // Aqui você deve adicionar o projeto ao cadastro
    res.status(201).json({ message: "Projeto adicionado com sucesso" });
});

// Rota para remover um projeto
app.delete('/projetos/:nome', (req, res) => {
    const nome = req.params.nome; // Aqui você deve remover o projeto pelo nome
    res.status(200).json({ message: "Projeto removido com sucesso" });
});

// Rota para buscar um projeto
app.get('/projetos/:nome', (req, res) => {
    const nome = req.params.nome; // Aqui você deve buscar o projeto pelo nome
    // Se o projeto for encontrado, retorne o projeto
    // Se não, retorne um erro 404
});

// Rota para listar projetos
app.get('/projetos', (req, res) => {
    // Aqui você deve listar todos os projetos
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));