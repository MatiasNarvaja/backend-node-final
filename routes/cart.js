const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/carrito', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await db('carrito')
      .join('productos', 'carrito.producto_id', 'productos.id')
      .select('carrito.id', 'productos.nombre', 'productos.precio', 'carrito.cantidad')
      .where('carrito.user_id', userId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

router.post('/carrito', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { producto_id, cantidad } = req.body;
    if (!producto_id || !cantidad) {
      return res.status(400).json({ error: 'Faltan campos' });
    }
    const producto = await db('productos').where({ id: producto_id }).first();
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const carritoItem = await db('carrito').where({ user_id: userId, producto_id }).first();
    if (carritoItem) {
      await db('carrito').where({ id: carritoItem.id }).update({ cantidad: carritoItem.cantidad + cantidad });
    } else {
      await db('carrito').insert({ user_id: userId, producto_id, cantidad });
    }
    res.json({ message: 'Producto agregado al carrito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

router.delete('/carrito/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;
    const item = await db('carrito').where({ id, user_id: userId }).first();
    if (!item) return res.status(404).json({ error: 'Producto en carrito no encontrado' });

    await db('carrito').where({ id }).del();
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
});

module.exports = router;
