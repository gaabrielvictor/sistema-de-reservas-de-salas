const express = require('express');
const router = express.Router();

let reservas = [];
let nextId = 1;


const { salas } = require('./salas');
const { usuarios } = require('./usuarios');

// Função auxiliar para converter "HH:MM" para minutos totais
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// -------------------------------
// Cria reserva
// -------------------------------
router.post('/', (req, res) => {
  const { usuario_id, sala_id, data, hora_inicio, hora_fim, motivo } = req.body;

  // Validando data no passado
  const today = new Date().toISOString().split('T')[0];
  if (data < today) {
    return res.status(400).json({ message: 'Não é permitido criar reserva no passado' });
  }

  const usuario = usuarios.find(u => u.id == usuario_id);
  const sala = salas.find(s => s.id == sala_id);

  if (!usuario) return res.status(400).json({ message: 'Usuário não cadastrado' });
  if (!sala) return res.status(400).json({ message: 'Sala não encontrada' });
  if (sala.status !== 'ativa') return res.status(400).json({ message: 'Sala inativa não pode ser reservada' });

  const inicioReq = timeToMinutes(hora_inicio);
  const fimReq = timeToMinutes(hora_fim);

  if (fimReq <= inicioReq) {
    return res.status(400).json({ message: 'hora_fim deve ser maior que hora_inicio' });
  }

  // Verifica sobreposição
  const overlap = reservas.some(r =>
    r.sala_id == sala_id && r.data === data &&
    (inicioReq < timeToMinutes(r.hora_fim) && fimReq > timeToMinutes(r.hora_inicio))
  );
  if (overlap) {
    return res.status(400).json({ message: 'Reserva sobreposta: conflito/horário sobreposto' });
  }

  const reserva = { id: nextId++, usuario_id, sala_id, data, hora_inicio, hora_fim, motivo };
  reservas.push(reserva);
  res.status(201).json(reserva);
});

// -------------------------------
// Lista e consulta reservas
// -------------------------------
router.get('/', (req, res) => {
  const { sala_id, usuario_id, data } = req.query;
  let result = reservas;
  if (sala_id) result = result.filter(r => r.sala_id == sala_id);
  if (usuario_id) result = result.filter(r => r.usuario_id == usuario_id);
  if (data) result = result.filter(r => r.data === data);
  res.json(result);
});

router.get('/:id', (req, res) => {
  const reserva = reservas.find(r => r.id == req.params.id);
  reserva ? res.json(reserva) : res.status(404).json({ message: 'Reserva não encontrada' });
});

// -------------------------------
// Atualiza reserva
// -------------------------------
router.put('/:id', (req, res) => {
  const reserva = reservas.find(r => r.id == req.params.id);
  if (!reserva) return res.status(404).json({ message: 'Reserva não encontrada' });

  const { hora_inicio, hora_fim, motivo } = req.body;
  const inicioReq = timeToMinutes(hora_inicio);
  const fimReq = timeToMinutes(hora_fim);

  if (fimReq <= inicioReq) {
    return res.status(400).json({ message: 'hora_fim deve ser maior que hora_inicio' });
  }

  // Verifica sobreposição com outras reservas
  const overlap = reservas.some(r =>
    r.id !== reserva.id &&
    r.sala_id === reserva.sala_id &&
    r.data === reserva.data &&
    (inicioReq < timeToMinutes(r.hora_fim) && fimReq > timeToMinutes(r.hora_inicio))
  );
  if (overlap) {
    return res.status(400).json({ message: 'Atualização causa sobreposição de horários' });
  }

  reserva.hora_inicio = hora_inicio ?? reserva.hora_inicio;
  reserva.hora_fim = hora_fim ?? reserva.hora_fim;
  reserva.motivo = motivo ?? reserva.motivo;
  res.json(reserva);
});

// -------------------------------
// Cancelar reserva
// -------------------------------
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

  const reserva = reservas.find(r => r.id === id);
  if (!reserva) return res.status(404).json({ message: 'Reserva não encontrada' });

  // Constrói data/hora da reserva no fuso horário local
  const [year, month, day] = reserva.data.split('-').map(Number);
  const [hours, minutes] = reserva.hora_inicio.split(':').map(Number);
  const reservaDateTime = new Date(year, month - 1, day, hours, minutes, 0);
  const now = new Date();

  // Se o horário atual for igual ou posterior ao início, bloqueia cancelamento
  if (now.getTime() >= reservaDateTime.getTime()) {
    return res.status(400).json({ message: 'Cancelamento só pode ocorrer antes do início' });
  }

  reservas = reservas.filter(r => r.id !== id);
  res.status(204).send();
});

// -------------------------------
// Consultar salas disponíveis
// -------------------------------
router.get('/salas/disponiveis', (req, res) => {
  const { data, hora_inicio, hora_fim } = req.query;

  if (!data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ message: 'Parâmetros obrigatórios ausentes' });
  }

  if (isNaN(Date.parse(data))) {
    return res.status(400).json({ message: 'Data inválida' });
  }

  const inicioReq = timeToMinutes(hora_inicio);
  const fimReq = timeToMinutes(hora_fim);

  if (isNaN(inicioReq) || isNaN(fimReq)) {
    return res.status(400).json({ message: 'Formato de hora inválido. Use HH:MM' });
  }

  if (fimReq <= inicioReq) {
    return res.status(400).json({ message: 'hora_fim deve ser maior que hora_inicio' });
  }

  const salasAtivas = salas.filter(s => s.status === 'ativa');
  const disponiveis = salasAtivas.filter(s =>
    !reservas.some(r =>
      r.sala_id == s.id &&
      r.data === data &&
      (inicioReq < timeToMinutes(r.hora_fim) && fimReq > timeToMinutes(r.hora_inicio))
    )
  );

  res.json(disponiveis);
});

module.exports = { router, reservas, salas, usuarios };
