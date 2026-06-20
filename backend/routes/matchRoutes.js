'use strict';

const { Router }      = require('express');
const matchController = require('../controllers/matchController');

const router = Router();

router.get('/',        matchController.getMatches);
router.get('/:id',     matchController.getMatchById);
router.post('/',       matchController.createMatch);
router.put('/:id',     matchController.updateMatch);
router.delete('/:id',  matchController.deleteMatch);

module.exports = router;
