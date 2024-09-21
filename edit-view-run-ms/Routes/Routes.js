const express = require('express');
const Controller = require('../Controllers/Controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();


router.post('/submit', upload.single('input_file'), Controller.submitProblem);
router.post('/finalSubmition', Controller.finalSubmition);
router.post('/edit', upload.single('input_file'), Controller.editProblem);
router.get('/health', Controller.getHealth);

router.delete('/delete', Controller.deleteProblem);
router.get('/view', Controller.viewProblems);
router.get('/viewAll', Controller.viewAllProblems);

module.exports = router;