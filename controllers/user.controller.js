const User = require('../models/user.model');
const Role = require('../models/role.model');

function getAllUsers(req, res) {
  try {
    const { limit, offset, search } = req.query;
    let users;
    if (req.user && req.user.role_name) {
      if (req.user.role_name === 'ADMIN') {
        users = User.getAll({ limit, offset, search });
      } else {
        users = [User.getById(req.user.id)];
      }
    } else {
      users = [];
    }
    res.json({ users });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

function getUserById(req, res) {
  try {
    // Solo admin puede ver cualquier usuario, usuario normal solo puede ver su propio usuario
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const user = User.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (req.user.role_name !== 'ADMIN' && req.user.id !== user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    res.json({ user });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
}

function createUser(req, res) {
  try {
    let role_id = req.body.role_id;
    console.log('Token user:', req.user);
    console.log('Body role_id:', req.body.role_id);
    if (!req.user || req.user.role_name !== 'ADMIN') {
      // Si no es admin, asignar siempre el rol USUARIO
      const usuarioRole = Role.getByName('USUARIO');
      role_id = usuarioRole ? usuarioRole.id : null;
    }
    const result = User.create({ email: req.body.email, password: req.body.password, role_id });
    res.status(201).json({ success: true, userId: result.lastInsertRowid });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).json({ error: 'Error al crear: ' + err.message });
  }
}

function updateUser(req, res) {
  try {
    let role_id = req.body.role_id;
    if (!req.user || req.user.role_name !== 'ADMIN') {
      // Si no es admin, mantener el rol actual del usuario
      const user = User.getById(req.params.id);
      role_id = user ? user.role_id : null;
    }
    User.update(req.params.id, { email: req.body.email, password: req.body.password, role_id });
    res.json({ success: true });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).json({ error: 'Error al actualizar: ' + err.message });
  }
}

function deleteUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    // Solo admin puede eliminar cualquier usuario, usuario normal solo puede eliminarse a sí mismo
    if (req.user.role_name !== 'ADMIN' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    User.softDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Error al eliminar' });
  }
}

function renderNewUserForm(req, res) {
  const roles = Role.getAll();
  res.render('users/new', { roles, sessionUser: req.user });
}

function renderEditUserForm(req, res) {
  const user = User.getById(req.params.id);
  if (!user) return res.status(404).send('Usuario no encontrado');
  const roles = Role.getAll();
  res.render('users/edit', { user, roles, sessionUser: req.user });
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, renderNewUserForm, renderEditUserForm };