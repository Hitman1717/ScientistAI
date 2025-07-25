const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createSession,
  getSessions,
  getSessionQueries,
  deleteSession,
} = require('../controllers/sessionController');

router.post('/new', auth, createSession);
router.get('/', auth, getSessions);
router.get('/:id/queries', auth, getSessionQueries);
router.delete('/:id', auth, deleteSession);

module.exports = router;
