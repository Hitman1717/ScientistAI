const express = require('express');
const router = express.Router();
const agents = require('../utils/agents');

router.get('/', (req, res) => {
  res.json(Object.keys(agents).map(key => ({
    key,
    name: agents[key].name
  })));
});

module.exports = router;
