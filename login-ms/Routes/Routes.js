const express = require('express');
const Controller = require('../Controllers/Controller');

const router = express.Router();
router.post('/register', Controller.registerUser);
router.get('/test', Controller.test_endpoint);
router.post('/login', Controller.authenticateUser);
router.post('/logout', Controller.logout);
router.get('/users', Controller.getUsers);
router.get('/health', Controller.getHealth);

router.get('/view_temp_credits/:username', Controller.viewTempCredits);
router.get('/view_credits/:username', Controller.viewCredits);

router.post('/change_temp_credits/:username/:value', Controller.addTempCredits);
router.post('/change_credits/:username/:value', Controller.addCredits);
module.exports = router;