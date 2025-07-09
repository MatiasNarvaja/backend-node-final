const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcrypt');

function renderLoginForm(req, res) {
  res.render('auth/login', { error: null });
}

function login(req, res) {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  console.log('Login intento:', { email, password, userPassword: user && user.password });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).render('auth/login', { error: 'Credenciales inválidas' });
  }
  // Obtener el nombre del rol
  let role_name = null;
  if (user.role_id) {
    const role = Role.getById(user.role_id);
    role_name = role ? role.name : null;
  }
  req.session.user = { id: user.id, email: user.email, role_id: user.role_id, role_name };
  res.redirect('/');
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
}

module.exports = { renderLoginForm, login, logout }; 