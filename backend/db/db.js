'use strict';

const mysql    = require('mysql2/promise');
const dbConfig = require('../config/database');

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.info('[DB] Pool inicializado.');
  }
  return pool;
};

/**
 * Normaliza una fecha proveniente de <input type="datetime-local">
 * ("YYYY-MM-DDTHH:mm") al formato DATETIME que MySQL exige
 * en modo estricto ("YYYY-MM-DD HH:mm:ss").
 *
 * @param   {string} value
 * @returns {string}
 */
const toMysqlDatetime = (value) => {
  if (!value) return value;
  const normalized = value.replace('T', ' ');
  return normalized.length === 16 ? `${normalized}:00` : normalized;
};

// ── READ ──────────────────────────────────────────────────────────

const getMatches = async () => {
  const [rows] = await getPool().execute(`
    SELECT id, team_home, team_away, goals_home, goals_away,
           match_status, match_date, updated_at
    FROM matches ORDER BY match_date ASC
  `);
  return rows;
};

const getMatchById = async (id) => {
  const [rows] = await getPool().execute(`
    SELECT id, team_home, team_away, goals_home, goals_away,
           match_status, match_date, updated_at
    FROM matches WHERE id = ? LIMIT 1
  `, [id]);
  return rows[0] ?? null;
};

// ── WRITE ─────────────────────────────────────────────────────────

const createMatch = async (data) => {
  const { team_home, team_away, goals_home, goals_away, match_status, match_date } = data;
  const [result] = await getPool().execute(`
    INSERT INTO matches (team_home, team_away, goals_home, goals_away, match_status, match_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [team_home, team_away, goals_home, goals_away, match_status, toMysqlDatetime(match_date)]);
  return { insertId: result.insertId };
};

const updateMatch = async (id, data) => {
  const { goals_home, goals_away, match_status, team_home, team_away, match_date } = data;
  const [result] = await getPool().execute(`
    UPDATE matches
    SET goals_home = ?, goals_away = ?, match_status = ?,
        team_home = ?, team_away = ?, match_date = ?
    WHERE id = ?
  `, [goals_home, goals_away, match_status, team_home, team_away, toMysqlDatetime(match_date), id]);
  return { affectedRows: result.affectedRows };
};

const deleteMatch = async (id) => {
  const [result] = await getPool().execute(
    'DELETE FROM matches WHERE id = ?', [id]
  );
  return { affectedRows: result.affectedRows };
};

// ── LIFECYCLE ─────────────────────────────────────────────────────

const closePool = async () => {
  if (pool) { await pool.end(); pool = null; }
};

module.exports = { getPool, getMatches, getMatchById, createMatch, updateMatch, deleteMatch, closePool };
