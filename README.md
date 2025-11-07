## 🏫 Sistema de Reservas de Salas — UNIFACISA

API RESTful desenvolvida em Node.js com Express, que gerencia salas, usuários e reservas em um sistema simples de agendamento.
O projeto foi criado como parte da disciplina de Engenharia de Software / Testes de Software, com foco na criação e execução de casos de teste.

📋 Sumário

Visão Geral

Tecnologias Utilizadas

Instalação e Execução

Endpoints da API

Usuários

Salas

Reservas

Disponibilidade de Salas

Validações e Regras de Negócio

Casos de Teste Implementados

Autor

⚙️ Visão Geral

O sistema permite:

Cadastrar e gerenciar usuários.

Cadastrar e gerenciar salas (ativas/inativas).

Criar, atualizar e cancelar reservas de salas.

Consultar salas disponíveis em um intervalo de horário específico.

A API foi projetada para ser simples, mas com validações robustas de conflito, horários e regras de negócio, simulando o funcionamento de um sistema real de agendamento.

🧠 Tecnologias Utilizadas

Node.js

Express.js

Postman (para testes)

JavaScript (ES6+)

Nodemon (para desenvolvimento)

JSON como base de dados em memória

🚀 Instalação e Execução
1️⃣ Clone o repositório
git clone https://github.com/seuusuario/api-reservas-salas.git
cd api-reservas-salas

2️⃣ Instale as dependências
npm install

3️⃣ Execute o servidor
npm start


O servidor será iniciado em:
http://localhost:8080

📡 Endpoints da API
👤 Usuários

Rota base: /usuarios

Método	Rota	Descrição
POST	/	Cria um novo usuário
GET	/	Lista todos os usuários
GET	/:id	Retorna um usuário específico
PUT	/:id	Atualiza os dados de um usuário
DELETE	/:id	Remove um usuário

Exemplo de criação:

POST /usuarios
{
  "nome": "Maria Silva",
  "email": "maria@unifacisa.edu.br"
}

🏢 Salas

Rota base: /salas

Método	Rota	Descrição
POST	/	Cria uma nova sala
GET	/	Lista todas as salas
GET	/:id	Retorna uma sala específica
PUT	/:id	Atualiza informações da sala
DELETE	/:id	Exclui uma sala

Exemplo de criação:

POST /salas
{
  "nome": "Lab A101",
  "tipo": "laboratório",
  "capacidade": 30,
  "status": "ativa"
}

📅 Reservas

Rota base: /reservas

Método	Rota	Descrição
POST	/	Cria uma nova reserva
GET	/	Lista todas as reservas (pode filtrar por sala_id, usuario_id, data)
GET	/:id	Consulta uma reserva específica
PUT	/:id	Atualiza uma reserva existente
DELETE	/:id	Cancela uma reserva (apenas antes do início)

Exemplo de criação:

POST /reservas
{
  "usuario_id": 1,
  "sala_id": 1,
  "data": "2025-11-10",
  "hora_inicio": "10:00",
  "hora_fim": "12:00",
  "motivo": "Aula de programação"
}

🔍 Disponibilidade de Salas

Rota base: /salas/disponiveis

Método	Rota	Descrição
GET	/salas/disponiveis?data=YYYY-MM-DD&hora_inicio=HH:MM&hora_fim=HH:MM	Lista as salas ativas disponíveis no período informado

Exemplo:

GET /salas/disponiveis?data=2025-11-10&hora_inicio=08:00&hora_fim=09:00

🧩 Validações e Regras de Negócio

✅ Usuários

E-mail deve conter @.

Não pode haver e-mail duplicado.

✅ Salas

Capacidade deve ser um número positivo.

Nomes duplicados não são permitidos.

Apenas salas com status = "ativa" podem ser reservadas.

✅ Reservas

hora_fim deve ser maior que hora_inicio.

Não é permitido criar reserva no passado.

Reservas não podem se sobrepor (conflito de horário).

Cancelamento só pode ocorrer antes do horário de início.

🧪 Casos de Teste Implementados
Reservas

✅ Criar reserva válida

❌ Reserva com hora_fim <= hora_inicio

❌ Reserva no passado

❌ Reserva sobreposta

✅ Cancelar antes do início

❌ Cancelar após início

❌ Atualizar reserva gerando conflito

✅ Consultar reservas (todos os filtros)

Salas

✅ Criar, atualizar e excluir

❌ Nome duplicado

❌ Capacidade inválida

❌ Reserva em sala inativa

Disponibilidade

✅ Buscar salas livres

❌ Parâmetros inválidos (data ou horário)

✅ Garantir que salas inativas não apareçam

👨‍💻 Autor

Gabriel Victor
Desenvolvido como parte do curso da UNIFACISA
📅 Ano: 2025
📧 Contato: gabrielflavictor@gmail.com

![Badge Status](https://img.shields.io/badge/status-online-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
