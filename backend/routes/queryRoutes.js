const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { askAgent, getUserQueries } = require('../controllers/queryController');

router.post('/ask', auth, askAgent);


module.exports = router;
