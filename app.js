const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const permisoRoutes = require('./routes/permiso.routes');
const authRoutes = require('./routes/auth.routes');
const createError = require('http-errors');
const userController = require('./controllers/user.controller');

const JWT_SECRET = 'jwt_super_secreto'; // Debe ser igual al usado en el controlador

// Instancia de la app
const app = express();

// Configuracion de entorno 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware opcional para /register: si hay token, decodifica el usuario
app.post('/register', (req, res, next) => {
  console.log('Middleware /register, headers:', req.headers);
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, JWT_SECRET);
      req.user = user;
    } catch (err) {
      // Token inválido, ignorar y continuar como usuario no autenticado
      req.user = undefined;
    }
  }
  next();
}, userController.createUser);

// Middleware de autenticación JWT global (excepto login y archivos públicos)
app.use((req, res, next) => {
  const openPaths = ['/login', '/users/new'];
  if (openPaths.includes(req.path) || req.path.startsWith('/public')) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Token de autenticación requerido');
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send('Token inválido o expirado');
  }
});

// Configuracion de rutas
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/permisos', permisoRoutes);
app.use(authRoutes);

// Configuracion de redireccion (por defecto)
app.get('/', (req, res) => {
  res.redirect('/users');
});

// Middleware de error 404
app.use((req, res, next) => {
  next(createError(404, 'Ruta no encontrada'));
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, error: app.get('env') === 'development' ? err : {} });
});

module.exports = app;