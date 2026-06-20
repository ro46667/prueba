'use strict';

const db = require('../db/db');

const VALID_STATUSES = ['Pendiente', 'En Curso', 'Finalizado'];

const buildResult = ({ match_status, goals_home, goals_away }) =>
  match_status === 'Pendiente' ? null : `${goals_home} - ${goals_away}`;

const enrich = (match) => ({ ...match, result: buildResult(match) });

const getAllMatches = async () => (await db.getMatches()).map(enrich);

const getMatchById = async (id) => {
  const match = await db.getMatchById(id);
  if (!match) throw Object.assign(new Error(`Partido id=${id} no encontrado.`), { statusCode: 404 });
  return enrich(match);
};

const validateFields = ({ team_home, team_away, goals_home, goals_away, match_status, match_date }) => {
  if (!team_home?.trim() || !team_away?.trim())
    throw Object.assign(new Error('team_home y team_away son obligatorios.'), { statusCode: 422 });
  if (team_home.trim() === team_away.trim())
    throw Object.assign(new Error('Un equipo no puede jugar contra sí mismo.'), { statusCode: 422 });
  if (goals_home < 0 || goals_away < 0)
    throw Object.assign(new Error('Los goles no pueden ser negativos.'), { statusCode: 422 });
  if (!VALID_STATUSES.includes(match_status))
    throw Object.assign(new Error(`match_status inválido. Valores: ${VALID_STATUSES.join(', ')}.`), { statusCode: 422 });
  if (!match_date)
    throw Object.assign(new Error('match_date es obligatorio.'), { statusCode: 422 });
};

const createMatch = async (data) => {
  validateFields(data);
  const { insertId } = await db.createMatch(data);
  return getMatchById(insertId);
};

const updateMatch = async (id, data) => {
  validateFields(data);
  const existing = await db.getMatchById(id);
  if (!existing) throw Object.assign(new Error(`Partido id=${id} no encontrado.`), { statusCode: 404 });
  const { affectedRows } = await db.updateMatch(id, data);
  if (affectedRows === 0) throw Object.assign(new Error('No se pudo actualizar.'), { statusCode: 500 });
  return getMatchById(id);
};

const deleteMatch = async (id) => {
  const existing = await db.getMatchById(id);
  if (!existing) throw Object.assign(new Error(`Partido id=${id} no encontrado.`), { statusCode: 404 });
  const { affectedRows } = await db.deleteMatch(id);
  if (affectedRows === 0) throw Object.assign(new Error('No se pudo eliminar.'), { statusCode: 500 });
  return { deleted: true, id };
};

module.exports = { getAllMatches, getMatchById, createMatch, updateMatch, deleteMatch };
