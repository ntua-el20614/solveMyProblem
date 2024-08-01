const express = require('express');
const Controller = require('../Controllers/Controller');

const router = express.Router();
router.post('/register', Controller.registerUser);
router.get('/test', Controller.test_endpoint);
router.post('/login', Controller.authenticateUser);
router.post('/logout', Controller.logout);
router.get('/users', Controller.getUsers);

module.exports = router;