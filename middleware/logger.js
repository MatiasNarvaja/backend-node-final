const db = require('../db');

const logger = async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    try {
      const userId = req.user ? req.user.userId : null;
      const logEntry = {
        timestamp: new Date().toISOString(),
        user_id: userId,
        endpoint: req.originalUrl,
        metodo: req.method,
        estado: res.statusCode,
        mensaje: res.statusMessage || ''
      };
      await db('logs').insert(logEntry);
    } catch (err) {
      console.error('Error guardando log:', err);
    }
  });

  next();
};

module.exports = logger;
