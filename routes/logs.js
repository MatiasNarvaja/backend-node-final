const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado' });
};

router.get('/logs', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const logs = await db('logs').orderBy('timestamp', 'desc').limit(100);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener logs' });
  }
});

module.exports = router;
