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

router.put('/productos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;
  if (!nombre && !precio) return res.status(400).json({ error: 'Faltan campos para actualizar' });

  try {
    const producto = await db('productos').where({ id }).first();
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (precio) updateData.precio = precio;

    await db('productos').where({ id }).update(updateData);
    const productoActualizado = await db('productos').where({ id }).first();
    res.json({ message: 'Producto actualizado', producto: productoActualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.delete('/productos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await db('productos').where({ id }).first();
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await db('productos').where({ id }).del();
    res.json({ message: 'Producto eliminado', productoEliminado: producto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
