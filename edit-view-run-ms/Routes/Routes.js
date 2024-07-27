const express = require('express');
const Controller = require('../Controllers/Controller');
const multer = require('multer');
const router = express.Router();

router.get('/test', Controller.test_endpoint);
// theli sasma gia input file
router.post('/submit', Controller.submitProblem);

module.exports = router;

