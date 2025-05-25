const request = require('supertest');
const express = require('express');
const app = require('./server'); // Vamos precisar exportar o app do server.js

describe('Testes dos Endpoints da API', () => {
  let server;

  // Configuração antes dos testes
  beforeAll(() => {
    server = app.listen(0); // Porta aleatória para testes
  });

  // Limpeza após os testes
  afterAll((done) => {
    server.close(done);
  });

  // Teste do endpoint de listagem de projetos
  describe('GET /projetos', () => {
    it('deve retornar lista de projetos', async () => {
      const res = await request(server) // Usando server ao invés de app
        .get('/projetos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // Teste do endpoint de criação de projeto
  describe('POST /projetos', () => {
    it('deve criar um novo projeto', async () => {
      const novoProjeto = {
        projeto: 'Projeto Teste',
        serie: '9º Ano',
        professor: 'Professor Teste',
        descricao: 'Descrição do projeto teste',
        dataInicio: '2024-03-15',
        dataFim: '2024-04-15'
      };

      const res = await request(server) // Usando server ao invés de app
        .post('/projetos')
        .send(novoProjeto)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Dados salvos com sucesso');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('nome_projeto', novoProjeto.projeto);
    });

    it('deve retornar erro 500 quando dados estão inválidos', async () => {
      const projetoInvalido = {}; // Projeto sem dados obrigatórios

      const res = await request(server) // Usando server ao invés de app
        .post('/projetos')
        .send(projetoInvalido)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(res.body).toHaveProperty('error');
    });
  });
}); 