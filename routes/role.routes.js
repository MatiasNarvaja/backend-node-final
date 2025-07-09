const express = require('express');
const router = express.Router();
const controller = require('../controllers/role.controller');

router.get('/', controller.getAllRoles);
router.get('/new', controller.renderNewRoleForm);
router.get('/:id/edit', controller.renderEditRoleForm);
router.get('/:id', controller.getRoleById);
router.post('/', controller.createRole);
router.post('/:id', controller.updateRole);
router.post('/:id/delete', controller.deleteRole);

module.exports = router;

