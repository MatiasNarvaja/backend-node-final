const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jwt_super_secreto'; // Cambia esto en producción

function renderLoginForm(req, res) {
  res.render('auth/login', { error: null });
}

function login(req, res) {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    if (req.is('application/json')) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    return res.status(401).render('auth/login', { error: 'Credenciales inválidas' });
  }
  let role_name = null;
  if (user.role_id) {
    const role = Role.getById(user.role_id);
    role_name = role ? role.name : null;
  }
  const payload = { id: user.id, email: user.email, role_id: user.role_id, role_name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  if (req.is('application/json')) {
    return res.json({ token, user: payload });
  }
  // Para el login web, renderizar la vista con el token (o podrías redirigir y guardar el token en localStorage con JS)
  res.render('auth/login', { error: 'Login solo disponible por API (JWT)' });
}

function logout(req, res) {
  // No hay sesión que destruir con JWT, solo redirigir
  res.redirect('/login');
}

module.exports = { renderLoginForm, login, logout }; 