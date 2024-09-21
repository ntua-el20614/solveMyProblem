const express = require('express');
const Controller = require('../Controllers/Controller');

const router = express.Router();

router.get('/test', Controller.test_endpoint);
router.get('/view/:username', Controller.viewResults);
router.get('/health', Controller.getHealth);

module.exports = router;
