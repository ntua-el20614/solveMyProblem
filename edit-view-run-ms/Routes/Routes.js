const express = require('express');
const Controller = require('../Controllers/Controller');

const router = express.Router();

router.get('/test', Controller.test_endpoint);
router.post('/submit', Controller.submitProblem);

module.exports = router;

