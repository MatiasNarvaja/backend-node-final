const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/prueba', authMiddleware, (req, res) => {
  res.json({ message: 'Ruta protegida OK', user: req.user });
});

module.exports = router;
