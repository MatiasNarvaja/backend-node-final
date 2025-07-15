const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const logger = require('./middleware/logger');
const productRoutes = require('./routes/products');
const compraRoutes = require('./routes/compra');
const logsRoutes = require('./routes/logs');
const protectedRoutes = require('./routes/protected');
const authenticateToken = require('./middleware/authMiddleware');

app.use(express.json());
app.use(logger);

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', compraRoutes);
app.use('/api', logsRoutes);
app.use('/api', protectedRoutes);

app.get('/api/protegida', authenticateToken, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado', user: req.user });
});

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
