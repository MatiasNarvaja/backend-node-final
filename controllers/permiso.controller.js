const Permiso = require('../models/permiso.model');

function getAllPermisos(req, res) {
  try {
    const permisos = Permiso.getAll();
    res.render('permisos/index', { permisos });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al obtener permisos');
  }
}

function getPermisoById(req, res) {
  try {
    const permiso = Permiso.getById(req.params.id);
    if (!permiso) return res.status(404).send('Permiso no encontrado');
    res.render('permisos/detail', { permiso });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al buscar el permiso');
  }
}

function renderNewPermisoForm(req, res) {
  res.render('permisos/new');
}

function renderEditPermisoForm(req, res) {
  try {
    const permiso = Permiso.getById(req.params.id);
    if (!permiso) return res.status(404).send('Permiso no encontrado');
    res.render('permisos/edit', { permiso });
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al cargar formulario');
  }
}

function createPermiso(req, res) {
  try {
    Permiso.create(req.body);
    res.redirect('/permisos');
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).render('permisos/error', { message: 'Error al crear: ' + err.message });
  }
}

function updatePermiso(req, res) {
  try {
    Permiso.update(req.params.id, req.body);
    res.redirect('/permisos');
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(400).render('permisos/error', { message: 'Error al actualizar: ' + err.message });
  }
}

function deletePermiso(req, res) {
  try {
    Permiso.remove(req.params.id);
    res.redirect('/permisos');
  } catch (err) {
    console.error('[Error]', err.message);
    res.status(500).send('Error al eliminar');
  }
}

module.exports = {
  getAllPermisos,
  getPermisoById,
  renderNewPermisoForm,
  renderEditPermisoForm,
  createPermiso,
  updatePermiso,
  deletePermiso
}; 