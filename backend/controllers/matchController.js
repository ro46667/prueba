'use strict';

const matchService = require('../services/matchService');

const parseId = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ success: false, message: 'id debe ser un entero positivo.' });
    return null;
  }
  return id;
};

const parseMatchBody = (body) => ({
  team_home:    String(body.team_home   ?? '').trim(),
  team_away:    String(body.team_away   ?? '').trim(),
  goals_home:   parseInt(body.goals_home,  10) || 0,
  goals_away:   parseInt(body.goals_away,  10) || 0,
  match_status: String(body.match_status ?? '').trim(),
  match_date:   body.match_date ?? null,
});

// GET /api/matches
const getMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getAllMatches();
    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (e) { next(e); }
};

// GET /api/matches/:id
const getMatchById = async (req, res, next) => {
  try {
    const id = parseId(req, res); if (!id) return;
    const match = await matchService.getMatchById(id);
    res.status(200).json({ success: true, data: match });
  } catch (e) { next(e); }
};

// POST /api/matches
const createMatch = async (req, res, next) => {
  try {
    const data = parseMatchBody(req.body);
    const match = await matchService.createMatch(data);
    res.status(201).json({ success: true, message: 'Partido creado.', data: match });
  } catch (e) { next(e); }
};

// PUT /api/matches/:id
const updateMatch = async (req, res, next) => {
  try {
    const id = parseId(req, res); if (!id) return;
    const data = parseMatchBody(req.body);
    const match = await matchService.updateMatch(id, data);
    res.status(200).json({ success: true, message: `Partido id=${id} actualizado.`, data: match });
  } catch (e) { next(e); }
};

// DELETE /api/matches/:id
const deleteMatch = async (req, res, next) => {
  try {
    const id = parseId(req, res); if (!id) return;
    const result = await matchService.deleteMatch(id);
    res.status(200).json({ success: true, message: `Partido id=${id} eliminado.`, data: result });
  } catch (e) { next(e); }
};

module.exports = { getMatches, getMatchById, createMatch, updateMatch, deleteMatch };
