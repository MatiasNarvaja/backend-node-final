const express = require('express');
const router = express.Router();
const controller = require('../controllers/permiso.controller');

router.get('/', controller.getAllPermisos);
router.get('/new', controller.renderNewPermisoForm);
router.get('/:id/edit', controller.renderEditPermisoForm);
router.get('/:id', controller.getPermisoById);
router.post('/', controller.createPermiso);
router.post('/:id', controller.updatePermiso);
router.post('/:id/delete', controller.deletePermiso);

module.exports = router; 