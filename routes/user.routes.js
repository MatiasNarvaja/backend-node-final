const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);
router.get('/new', controller.renderNewUserForm);
router.get('/:id', controller.getUserById);
router.get('/:id/edit', controller.renderEditUserForm);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;