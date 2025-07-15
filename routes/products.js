const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/productos', async (req, res) => {
  try {
    const productos = await db('productos').select('*');
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.post('/productos', authenticateToken, async (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) return res.status(400).json({ error: 'Faltan campos' });

  try {
    const [id] = await db('productos').insert({ nombre, precio });
    res.status(201).json({ id, nombre, precio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

module.exports = router;
