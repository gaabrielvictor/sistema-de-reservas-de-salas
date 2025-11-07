const express = require('express');
const router = express.Router();

let usuarios = [];
let nextId = 1;

// cria o usuário
router.post('/', (req, res) => {
  const { nome, email } = req.body;
  if (!email.includes('@')) return res.status(400).json({ message: 'Email inválido' });
  if (usuarios.some(u => u.email === email)) return res.status(409).json({ message: 'Email duplicado' });
  const usuario = { id: nextId++, nome, email };
  usuarios.push(usuario);
  res.status(201).json(usuario);
});

//  lista os usuários
router.get('/', (req, res) => res.json(usuarios));

//  consulta os usuário
router.get('/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id == req.params.id);
  usuario ? res.json(usuario) : res.status(404).json({ message: 'Usuário não encontrado' });
});

//  atualiza o usuário
router.put('/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
  const { nome, email } = req.body;
  if (email && usuarios.some(u => u.email === email && u.id != usuario.id)) return res.status(409).json({ message: 'Email duplicado' });
  usuario.nome = nome ?? usuario.nome;
  usuario.email = email ?? usuario.email;
  res.json(usuario);
});

//  deleta o usuário
router.delete('/:id', (req, res) => {
  const index = usuarios.findIndex(u => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' });
  usuarios.splice(index, 1);
  res.status(204).send();
});

module.exports = {router, usuarios} ;
