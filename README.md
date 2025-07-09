# Gestión de Usuarios (Node.js + Express + EJS)

Este proyecto es una aplicación web para la gestión de usuarios, roles y permisos, desarrollada con Node.js, Express, SQLite y EJS como motor de vistas.

## Características principales

- Autenticación de usuarios con email y contraseña (hash con bcrypt).
- Gestión de roles (ADMIN y USUARIO por defecto).
- Solo los usuarios con rol ADMIN pueden ver, editar y eliminar todos los usuarios.
- Los usuarios con rol USUARIO solo pueden ver y editar su propio perfil.
- Creación y edición de usuarios con formularios modernos (Bootstrap).
- Protección de rutas: solo usuarios autenticados pueden acceder a las funcionalidades.
- Gestión de sesiones con express-session.

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <URL_DEL_REPO>
   cd <NOMBRE_DEL_REPO>
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **(Opcional) Elimina la base de datos para empezar de cero:**
   ```bash
   del usuarios.db # o rm usuarios.db en Linux/Mac
   ```

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```
   O bien:
   ```bash
   node ./bin/www
   ```

5. **Accede a la app:**
   Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Primeros pasos

- Crea un usuario con rol ADMIN para poder gestionar el sistema.
- Los usuarios no-admin solo pueden ver y editar su propio perfil.
- El campo de rol solo es visible y editable para usuarios ADMIN.

## Estructura del proyecto

- `app.js` — Configuración principal de la app Express.
- `controllers/` — Lógica de negocio para usuarios, roles, permisos y autenticación.
- `models/` — Acceso a datos y lógica de base de datos (SQLite).
- `routes/` — Definición de rutas Express.
- `views/` — Vistas EJS para frontend.
- `public/` — Archivos estáticos (CSS, imágenes).
- `usuarios.db` — Base de datos SQLite (se crea automáticamente).

## Dependencias principales

- express
- ejs
- better-sqlite3
- express-session
- bcrypt
- morgan

## Notas de seguridad
- Las contraseñas se almacenan hasheadas con bcrypt.
- No subas el archivo `usuarios.db` a producción ni a repositorios públicos.
- Cambia el valor de `secret` en la configuración de sesión para producción.

---

¡Contribuciones y sugerencias son bienvenidas! 