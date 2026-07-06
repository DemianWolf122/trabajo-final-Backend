# Chat App — Backend

Backend del TP integrador (Full-Stack: React + Express) de una **app de mensajería tipo WhatsApp**: gestión de contactos y mensajes con autenticación completa.

- **API en producción:** https://trabajo-final-backend-etnv.onrender.com
- **Frontend (web):** https://trabajo-final-front-end-clonwhatsap.vercel.app
- **Repo del frontend:** https://github.com/DemianWolf122/trabajo-final-FrontEnd

> Nota: la API está en el plan gratuito de Render, que "se duerme" tras inactividad. La primera petición puede tardar ~50 segundos (arranque en frío); las siguientes son inmediatas.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt (autenticación)
- Nodemailer (verificación de email)
- Arquitectura en capas: `routes → controllers → services → repositories → models`

## Modelo de datos

- **User**: `nombre, email (único), password (hash), email_verificado, fecha_creacion`
- **Contacto** (entidad principal): `nombre, profile_picture, isGroup, fk_usuario (ref User), fecha_creacion`
- **Mensaje** (entidad relacionada): `texto, send_by_me, leido, fk_contacto (ref Contacto), fk_usuario (ref User), fecha`
- **Comunidad** (entidad extra): `nombre, descripcion, icon, groups[] (subdocumentos: nombre, unread), fk_usuario (ref User), fecha_creacion`

Relación: cada **Mensaje** referencia a un **Contacto** (`ref` + `populate`), y contactos, mensajes y comunidades pertenecen a un **User** (`ref`).

## Seguridad y middlewares

- **CORS** habilitado globalmente.
- **Autenticación JWT**: middleware `authMiddleware` lee `Authorization: Bearer <token>`, verifica el token y expone `req.user`. Tokens con expiración (`JWT_EXPIRES_IN`).
- **Hash de contraseñas** con `bcrypt` (cost 12).
- **Validación de input** (`validate.middleware.js`):
  - `validateObjectId(param)`: rechaza IDs de ruta/query malformados con **400** antes de tocar la base (evita errores de casteo).
  - `validateFields(reglas)`: valida por campo **requerido, tipo** (string/boolean/number), **longitud** (min/max) y **formato** (regex, ej. email).
- **Whitelist en actualizaciones**: los `PUT` sólo aplican los campos permitidos de cada entidad; nunca se persiste el objeto entero recibido (no se pueden pisar `fk_usuario`, `fecha_creacion`, etc.).
- **Manejo centralizado de errores** (`error.middleware.js`): captura los `ServerError` y responde con el status y mensaje adecuados.
- **Pertenencia**: cada operación verifica que el recurso pertenezca al usuario logueado (403 si no).

## Instalación

1. Instalá dependencias:
   ```
   npm install
   ```
2. Copiá `.env.example` a `.env` y completá:
   - `MONGO_DB_CONNECTION_STRING`: connection string de MongoDB Atlas. **Obligatorio.**
   - `JWT_SECRET`: secret aleatorio (256 bits). **Obligatorio.**
   - `GMAIL_USERNAME` / `GMAIL_PASSWORD`: **opcionales** (solo para enviar el mail de verificación real).
3. (Opcional) Cargá el usuario de prueba y datos de ejemplo:
   ```
   npm run seed
   ```
4. Levantá el servidor:
   ```
   npm run dev
   ```
   Corre en `http://localhost:8080`.

## Envío de emails (¿hace falta Gmail?)

**No es obligatorio.** Usa `nodemailer`, pero funciona sin configurarlo: si no cargás `GMAIL_*`, el link de verificación se **imprime en consola** y se **devuelve en la respuesta** del `POST /register` (campo `verification_url`).

## Usuario de prueba (ya verificado)

`npm run seed` crea este usuario con el mail ya verificado y contactos/mensajes de ejemplo:

- **Email:** `demo@chat.com`
- **Password:** `ChatApp2026`

También existe **login de invitado**: `POST /api/auth/guest`.

## Documentación de endpoints

Todas las respuestas tienen la forma `{ message, ok, status, data? }`.

### Auth — `/api/auth` (públicas)

| Método | Ruta | Body / Query | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | `{ nombre, email, password }` | Crea el usuario (password hasheada), envía mail de verificación. |
| GET | `/api/auth/verify-email?verification_token=...` | — | Verifica el token y activa la cuenta. |
| POST | `/api/auth/login` | `{ email, password }` | Devuelve `{ token, user }` si es válido y el mail está verificado. |
| POST | `/api/auth/guest` | — | Login de invitado (usuario demo), sin credenciales. |

### Perfil — `/api/auth/me` (requiere `Authorization: Bearer <token>`)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/api/auth/me` | — | Datos del usuario logueado (sin el password). |
| PUT | `/api/auth/me` | `{ nombre }` | Actualiza el nombre del perfil (mín. 3 caracteres). |

### Contactos — `/api/contactos` (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/api/contactos` | — | Lista los contactos del usuario logueado. |
| GET | `/api/contactos/:id` | — | Detalle de un contacto propio. |
| POST | `/api/contactos` | `{ nombre, profile_picture? }` | Crea un contacto. `nombre` 2-50 caracteres. |
| PUT | `/api/contactos/:id` | `{ nombre?, profile_picture?, isGroup? }` | Edita un contacto propio (sólo campos permitidos). |
| DELETE | `/api/contactos/:id` | — | Elimina un contacto (y sus mensajes). |

### Mensajes — `/api/mensajes` (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/api/mensajes?contactoId=...` | — | Mensajes de un contacto (con el contacto populado). |
| POST | `/api/mensajes` | `{ texto, contactoId, send_by_me? }` | Envía un mensaje a un contacto. |
| DELETE | `/api/mensajes/vaciar/:contactoId` | — | Vacía todos los mensajes de un chat. |
| DELETE | `/api/mensajes/:id` | — | Borra un mensaje puntual. |

### Comunidades — `/api/comunidades` (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/api/comunidades` | — | Lista las comunidades del usuario logueado. |
| GET | `/api/comunidades/:id` | — | Detalle de una comunidad propia. |
| POST | `/api/comunidades` | `{ nombre, descripcion?, icon?, groups? }` | Crea una comunidad. `nombre` 2-60 caracteres. |
| PUT | `/api/comunidades/:id` | `{ nombre?, descripcion?, icon?, groups? }` | Edita una comunidad propia (sólo campos permitidos). |
| DELETE | `/api/comunidades/:id` | — | Elimina una comunidad. |

### Códigos de estado usados

`200` ok · `201` creado · `400` validación (campos, formato, ID inválido) · `401` sin token / token inválido · `403` recurso ajeno · `404` no encontrado · `500` error interno.

## Deploy

- **Backend:** desplegado en [Render](https://render.com) → https://trabajo-final-backend-etnv.onrender.com
- **Frontend:** desplegado en [Vercel](https://vercel.com) → https://trabajo-final-front-end-clonwhatsap.vercel.app
- Base de datos: MongoDB Atlas.
