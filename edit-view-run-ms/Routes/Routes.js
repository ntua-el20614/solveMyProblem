const express = require('express');
const testController = require('../Controllers/Controller');

const router = express.Router();

router.get('/test', testController.test_endpoint);

module.exports = router;
