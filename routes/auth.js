const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) 
    return res.status(400).json({ error: 'Faltan campos' });

  try {
    const existingUser = await db('usuarios').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario ya registrado' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [id] = await db('usuarios').insert({ email, password_hash: hash });
    res.status(201).json({ id, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) 
    return res.status(400).json({ error: 'Faltan campos' });

  try {
    const user = await db('usuarios').where({ email }).first();
    if (!user) 
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) 
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await db('usuarios').select('id', 'email', 'password_hash');
    res.json({
      message: 'Lista de usuarios con contraseñas hasheadas',
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        password_hash: user.password_hash,
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await db('usuarios').where({ id }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await db('usuarios').where({ id }).del();
    
    res.json({ 
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
