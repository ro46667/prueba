'use strict';

require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const matchRoutes = require('./routes/matchRoutes');
const { closePool } = require('./db/db');

const app  = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// ── Middlewares ───────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Rutas ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/matches', matchRoutes);   // ← prefijo /api/matches

// 404 catch-all
app.use((_req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada.' }));

// Error handler centralizado
app.use((err, _req, res, _next) => {
  const status  = err.statusCode || 500;
  const message = err.message    || 'Error interno del servidor.';
  console.error(`[ERROR] ${status} — ${message}`);
  res.status(status).json({ success: false, message });
});

// ── Start ─────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.info(`[SERVER] API en http://localhost:${PORT}`);
  console.info(`[SERVER] GET  /api/matches`);
  console.info(`[SERVER] POST /api/matches`);
  console.info(`[SERVER] PUT  /api/matches/:id`);
  console.info(`[SERVER] DEL  /api/matches/:id`);
});

const shutdown = async (sig) => {
  console.info(`\n[SERVER] ${sig} — cerrando...`);
  server.close(async () => { await closePool(); process.exit(0); });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

module.exports = app;
