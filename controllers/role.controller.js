// controllers/role.controller.js
const Role = require('../models/role.model');
const Permiso = require('../models/permiso.model');

function getAllRoles(req, res) {
  try {
    const roles = Role.getAll();
    res.json({ roles });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
}

function getRoleById(req, res) {
  try {
    const role = Role.getById(req.params.id);
    if (!role) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json({ role });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Error al buscar el rol' });
  }
}

function renderNewRoleForm(req, res) {
  res.render('roles/new');
}

function renderEditRoleForm(req, res) {
  try {
    const role = Role.getById(req.params.id);
    if (!role) return res.status(404).send('Rol no encontrado');
    const permisos = Permiso.getAll();
    const permisosAsignados = Role.getPermisos(req.params.id).map(p => p.id);
    res.render('roles/edit', { role, permisos, permisosAsignados });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al cargar formulario');
  }
}

function createRole(req, res) {
  try {
    const result = Role.create(req.body);
    res.status(201).json({ success: true, roleId: result.lastInsertRowid });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).json({ error: 'Error al crear: ' + err.message });
  }
}

function updateRole(req, res) {
  try {
    Role.update(req.params.id, req.body);
    // Actualizar permisos
    let permisos = req.body.permisos || [];
    if (!Array.isArray(permisos)) permisos = [permisos];
    permisos = permisos.map(Number);
    Role.setPermisos(req.params.id, permisos);
    res.json({ success: true });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).json({ error: 'Error al actualizar: ' + err.message });
  }
}

function deleteRole(req, res) {
  try {
    Role.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Error]', err.message);
    let message = 'Error al eliminar';
    if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
      message = 'No se puede eliminar el rol porque está siendo utilizado por usuarios o tiene permisos asignados.';
    }
    res.status(400).json({ error: message });
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  renderNewRoleForm,
  renderEditRoleForm,
  createRole,
  updateRole,
  deleteRole
};