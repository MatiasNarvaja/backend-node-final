const db = require('../config/db');
const chalk = require('chalk');
const bcrypt = require('bcrypt');

function getAll({ limit = 10, offset = 0, search = '', role = null }) {
  const baseQuery = `SELECT users.*, roles.name AS role_name FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE deleted_at IS NULL AND (email LIKE ?) ` +
    (role ? 'AND role_id = ? ' : '') +
    'ORDER BY id LIMIT ? OFFSET ?';

  const params = [`%${search}%`];
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

function create({ email, password, role_id }) {
  if (!email || !email.includes('@')) throw new Error('Email inválido');
  if (!password || password.length < 4) throw new Error('Contraseña inválida');
  const now = new Date().toISOString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(`
    INSERT INTO users (email, password, role_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(email, hashedPassword, role_id || null, now, now);
  console.log(chalk.green(`[DB] Usuario creado con ID ${result.lastInsertRowid}`));
  return result;
}

function update(id, { email, password, role_id }) {
  if (!email || !email.includes('@')) throw new Error('Email inválido');
  const now = new Date().toISOString();
  let result;
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    result = db.prepare(`
      UPDATE users SET email = ?, password = ?, role_id = ?, updated_at = ?
      WHERE id = ? AND deleted_at IS NULL
    `).run(email, hashedPassword, role_id || null, now, id);
  } else {
    result = db.prepare(`
      UPDATE users SET email = ?, role_id = ?, updated_at = ?
      WHERE id = ? AND deleted_at IS NULL
    `).run(email, role_id || null, now, id);
  }
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