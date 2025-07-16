const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado' });
};

const { Readable } = require('stream');

router.get('/logs', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const logs = await db('logs').orderBy('timestamp', 'desc').limit(100);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener logs' });
  }
});

router.get('/logs/descargar', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const logs = await db('logs').orderBy('timestamp', 'desc');
    let txtContent = '';
    logs.forEach(log => {
      txtContent += `ID: ${log.id} | Fecha: ${log.timestamp} | Usuario: ${log.user_id || 'N/A'} | Endpoint: ${log.endpoint} | Método: ${log.metodo} | Estado: ${log.estado} | Mensaje: ${log.mensaje}\n`;
    });

    res.setHeader('Content-Disposition', 'attachment; filename="logs.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(txtContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al descargar logs' });
  }
});

module.exports = router;
