const User = require('../models/user.model');

function renderLoginForm(req, res) {
  res.render('auth/login', { error: null });
}

function login(req, res) {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).render('auth/login', { error: 'Credenciales inválidas' });
  }
  // Aquí luego guardaremos el usuario en sesión
  res.redirect('/');
}

module.exports = { renderLoginForm, login }; 