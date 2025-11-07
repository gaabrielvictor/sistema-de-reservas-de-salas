const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Import routes
const salasRoutes = require('./routes/salas').router;
const usuariosRoutes = require('./routes/usuarios').router;
const reservasRoutes = require('./routes/reservas').router;


app.use('/salas', salasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/reservas', reservasRoutes);

// Disponibilidade
app.get('/salas/disponiveis', reservasRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
