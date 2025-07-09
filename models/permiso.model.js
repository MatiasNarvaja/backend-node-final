const db = require('../config/db');
const chalk = require('chalk');

function getAll() {
  const permisos = db.prepare('SELECT * FROM permisos').all();
  console.log(chalk.blue(`[DB] ${permisos.length} permisos encontrados`));
  return permisos;
}

function getById(id) {
  const permiso = db.prepare('SELECT * FROM permisos WHERE id = ?').get(id);
  console.log(permiso ? chalk.blue(`[DB] Permiso ID ${id} encontrado`) : chalk.yellow(`[DB] Permiso ID ${id} no encontrado`));
  return permiso;
}

function create({ nombre }) {
  if (!nombre || nombre.length < 3) throw new Error('Nombre del permiso inválido');
  nombre = nombre.toUpperCase();
  try {
    const result = db.prepare('INSERT INTO permisos (nombre) VALUES (?)').run(nombre);
    console.log(chalk.green(`[DB] Permiso creado con ID ${result.lastInsertRowid}`));
    return result;
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      throw new Error('El nombre del permiso ya existe');
    }
    throw err;
  }
}

function update(id, { nombre }) {
  if (!nombre || nombre.length < 3) throw new Error('Nombre del permiso inválido');
  nombre = nombre.toUpperCase();
  try {
    const result = db.prepare('UPDATE permisos SET nombre = ? WHERE id = ?').run(nombre, id);
    console.log(chalk.cyan(`[DB] Permiso ID ${id} actualizado (${result.changes} cambio/s)`));
    return result;
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      throw new Error('El nombre del permiso ya existe');
    }
    throw err;
  }
}

function remove(id) {
  const result = db.prepare('DELETE FROM permisos WHERE id = ?').run(id);
  console.log(chalk.red(`[DB] Permiso ID ${id} eliminado (${result.changes} cambio/s)`));
  return result;
}

module.exports = { getAll, getById, create, update, remove }; 