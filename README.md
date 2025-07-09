# Gestión de Usuarios — API REST (Node.js + Express + JWT)

> **Trabajo Práctico Final para la materia Desarrollo de sistemas web (Backend)**  
> Realizado por **Leonardo Morganti** y **Matias Narvaja**

Este proyecto es una API para la gestión de usuarios, roles y permisos, desarrollada con Node.js, Express, SQLite y autenticación JWT.

## Características principales

- API 100% JSON, sin vistas web.
- Autenticación y autorización con JWT.
- Gestión de roles (ADMIN y USUARIO por defecto).
- Solo los usuarios con rol ADMIN pueden ver, editar y eliminar todos los usuarios.
- Los usuarios con rol USUARIO solo pueden ver, editar y eliminar su propio usuario.
- Registro abierto: cualquier usuario puede registrarse con `/register` (rol USUARIO por defecto), pero un ADMIN puede crear usuarios con cualquier rol.
- Baja lógica de usuarios (soft delete).
- Protección de rutas: solo usuarios autenticados pueden acceder a la API (excepto `/login` y `/register`).

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/MatiasNarvaja/backend-node-final.git
   cd backend-node-final
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia la aplicación:**
   ```bash
   npm start
   ```


4. Seguridad
- Todas las rutas (excepto `/login` y `/register`) requieren JWT en el header:
  ```
  Authorization: Bearer <token>
  ```
- El token expira a los 15 minutos.
- Las contraseñas se almacenan hasheadas con bcrypt.

## Notas
- El registro de usuario es abierto, pero solo un admin puede asignar roles distintos a USUARIO.
