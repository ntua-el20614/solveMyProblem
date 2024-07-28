const express = require('express');
const Controller = require('../Controllers/Controller');

const router = express.Router();

router.get('/test', Controller.test_endpoint);
router.get('/view', Controller.viewResults);

module.exports = router;
