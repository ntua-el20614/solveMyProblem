const express = require('express');
const Controller = require('../Controllers/Controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/test', Controller.test_endpoint);
// theli sasma gia input file
router.post('/submit', upload.single('input_file'), Controller.submitProblem);

module.exports = router;

