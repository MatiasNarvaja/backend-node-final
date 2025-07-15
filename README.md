# Carrito Backend

API backend para la gestión de usuarios, productos y carritos de compra.

## Descripción
Este proyecto es una API RESTful desarrollada con Node.js y Express. Permite:
- Registro y autenticación de usuarios (con JWT y contraseñas hasheadas)
- Gestión de productos
- Manejo de carritos de compra por usuario
- Finalización de compras

La base de datos utilizada es SQLite3, gestionada mediante Knex.js.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/MatiasNarvaja/backend-node-final.git
   cd backend-node-final
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

- Para desarrollo (con recarga automática):
  ```bash
  npm run dev
  ```
- Para producción:
  ```bash
  npm start
  ```

El servidor se ejecutará por defecto en el puerto 3000, o el que definas en la variable de entorno `PORT`.

## Tecnologías utilizadas
- Node.js
- Express
- SQLite3 (Knex.js)
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- nodemon (desarrollo)

## Estructura de carpetas principal
- `routes/` — Rutas de la API (usuarios, productos, carrito, compras, etc.)
- `middleware/` — Middlewares personalizados (autenticación, logger, etc.)
- `migrations/` — Migraciones de la base de datos
- `public/` — Archivos públicos

## Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido de ejemplo:

```
PORT=3000
JWT_SECRET=tu_clave_secreta
```

## Enlaces
- Repositorio GitHub: [https://github.com/MatiasNarvaja/backend-node-final](https://github.com/MatiasNarvaja/backend-node-final) 