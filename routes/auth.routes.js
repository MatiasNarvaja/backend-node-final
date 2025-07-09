const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.get('/login', controller.renderLoginForm);
router.post('/login', controller.login);

module.exports = router; 