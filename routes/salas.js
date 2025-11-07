const express = require('express');
const router = express.Router();

let salas = [];
let nextId = 1;


// Função auxiliar para validar capacidade
function validarCapacidade(capacidade) {
  return Number.isInteger(capacidade) && capacidade > 0;
}

// Cria sala
router.post('/', (req, res) => {
  const { nome, tipo, capacidade, status } = req.body;

  if (!validarCapacidade(capacidade)) {
    return res.status(400).json({ message: 'Capacidade deve ser um número positivo' });
  }

  if (salas.some(s => s.nome === nome)) {
    return res.status(409).json({ message: 'Nome de sala duplicado' });
  }

  const sala = { id: nextId++, nome, tipo, capacidade, status };
  salas.push(sala);
  res.status(201).json(sala);
});

// Lista salas
router.get('/', (req, res) => res.json(salas));

// Consulta sala específica
router.get('/:id', (req, res) => {
  const sala = salas.find(s => s.id == req.params.id);
  sala ? res.json(sala) : res.status(404).json({ message: 'Sala não encontrada' });
});

// Atualiza sala
router.put('/:id', (req, res) => {
  const sala = salas.find(s => s.id == req.params.id);
  if (!sala) return res.status(404).json({ message: 'Sala não encontrada' });

  const { nome, tipo, capacidade, status } = req.body;

  if (nome && salas.some(s => s.nome === nome && s.id != sala.id)) {
    return res.status(409).json({ message: 'Nome de sala duplicado' });
  }

  if (capacidade !== undefined && !validarCapacidade(capacidade)) {
    return res.status(400).json({ message: 'Capacidade deve ser um número positivo' });
  }

  sala.nome = nome ?? sala.nome;
  sala.tipo = tipo ?? sala.tipo;
  sala.capacidade = capacidade ?? sala.capacidade;
  sala.status = status ?? sala.status;

  res.json(sala);
});

// Deleta sala
router.delete('/:id', (req, res) => {
  const index = salas.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Sala não encontrada' });
  salas.splice(index, 1);
  res.status(204).send();
});

module.exports = {router, salas};
