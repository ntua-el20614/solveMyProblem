const express = require('express');

const exampleController = require('../controllers/example');

const router = express.Router();

router.get('/endpoint', exampleController.getExampleEndpoint);

module.exports = router;