const db = require('../config/db');
const chalk = require('chalk');

function getAll({ limit = 10, offset = 0, search = '', role = null }) {
  const baseQuery = `SELECT users.*, roles.name AS role_name FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE deleted_at IS NULL AND (name LIKE ? OR email LIKE ?) ` +
    (role ? 'AND role_id = ? ' : '') +
    'ORDER BY id LIMIT ? OFFSET ?';

  const params = [`%${search}%`, `%${search}%`];
  if (role) params.push(role);
  params.push(Number(limit), Number(offset));

  const results = db.prepare(baseQuery).all(...params);
  console.log(chalk.blue(`[DB] Listado obtenido (${results.length} resultados)`));
  return results;
}

function getById(id) {
  const user = db.prepare(`SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`).get(id);
  console.log(user ? chalk.blue(`[DB] Usuario ID ${id} obtenido`) : chalk.yellow(`[DB] Usuario ID ${id} no encontrado`));
  return user;
}

function create({ name, email, role_id, password }) {
  if (!name || name.length < 2) throw new Error('Nombre inválido');
  if (!email || !email.includes('@')) throw new Error('Email inválido');
  const now = new Date().toISOString();
  password = password || 'password';
  const result = db.prepare(`
    INSERT INTO users (user, email, role_id, password, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, email, role_id || null, password, now, now);
  console.log(chalk.green(`[DB] Usuario creado con ID ${result.lastInsertRowid}`));
  return result;
}

function update(id, { name, email, role_id, password }) {
  if (!name || name.length < 2) throw new Error('Nombre inválido');
  if (!email || !email.includes('@')) throw new Error('Email inválido');
  const now = new Date().toISOString();
  // No actualizamos password desde aquí por seguridad
  const result = db.prepare(`
    UPDATE users SET name = ?, email = ?, role_id = ?, updated_at = ?
    WHERE id = ? AND deleted_at IS NULL
  `).run(name, email, role_id || null, now, id);
  console.log(chalk.cyan(`[DB] Usuario ID ${id} actualizado (${result.changes} cambio/s)`));
  return result;
}

function softDelete(id) {
  const now = new Date().toISOString();
  const result = db.prepare(`
    UPDATE users SET deleted_at = ? WHERE id = ?
  `).run(now, id);
  console.log(chalk.red(`[DB] Usuario ID ${id} marcado como eliminado`));
  return result;
}

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL').get(email);
}

module.exports = { getAll, getById, create, update, softDelete, findByEmail };