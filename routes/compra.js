const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/compra', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    await db('carrito').where({ user_id: userId }).del();
    res.json({ message: 'Compra finalizada, carrito limpio' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al finalizar compra' });
  }
});

module.exports = router;
