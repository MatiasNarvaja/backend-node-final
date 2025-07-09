const User = require('../models/user.model');
const Role = require('../models/role.model');

function getAllUsers(req, res) {
  try {
    const { limit, offset, search } = req.query;
    let users;
    const roles = Role.getAll();
    let showRoles = false;
    if (req.session.user && req.session.user.role_name) {
      if (req.session.user.role_name === 'ADMIN') {
        users = User.getAll({ limit, offset, search });
        showRoles = true;
      } else {
        users = [User.getById(req.session.user.id)];
      }
    } else {
      users = [];
    }
    res.render('users/index', { users, sessionUser: req.session.user, roles, showRoles });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al obtener usuarios');
  }
}

function getUserById(req, res) {
  try {
    const user = User.getById(req.params.id);
    if (!user) return res.status(404).send('Usuario no encontrado');
    res.render('users/detail', { user });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error en la búsqueda');
  }
}

function createUser(req, res) {
  try {
    let role_id = req.body.role_id;
    if (!req.session.user || req.session.user.role_name !== 'ADMIN') {
      // Si no es admin, asignar siempre el rol USUARIO
      const usuarioRole = Role.getByName('USUARIO');
      role_id = usuarioRole ? usuarioRole.id : null;
    }
    User.create({ email: req.body.email, password: req.body.password, role_id });
    res.redirect('/users');
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).send('Error al crear: ' + err.message);
  }
}

function updateUser(req, res) {
  try {
    let role_id = req.body.role_id;
    if (!req.session.user || req.session.user.role_name !== 'ADMIN') {
      // Si no es admin, mantener el rol actual del usuario
      const user = User.getById(req.params.id);
      role_id = user ? user.role_id : null;
    }
    User.update(req.params.id, { email: req.body.email, password: req.body.password, role_id });
    res.redirect('/users');
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).send('Error al actualizar: ' + err.message);
  }
}

function deleteUser(req, res) {
  try {
    User.softDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al eliminar');
  }
}

function renderNewUserForm(req, res) {
  const roles = Role.getAll();
  res.render('users/new', { roles });
}

function renderEditUserForm(req, res) {
  const user = User.getById(req.params.id);
  if (!user) return res.status(404).send('Usuario no encontrado');
  const roles = Role.getAll();
  res.render('users/edit', { user, roles });
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, renderNewUserForm, renderEditUserForm };