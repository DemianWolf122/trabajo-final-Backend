# Chat App — Backend

Backend del TP integrador (React + Express): una app de mensajería tipo WhatsApp (contactos, mensajes y comunidades) con autenticación.

- **API:** https://trabajo-final-backend-etnv.onrender.com
- **Web (frontend):** https://trabajo-final-front-end-clonwhatsap.vercel.app
- **Repo frontend:** https://github.com/DemianWolf122/trabajo-final-FrontEnd

> El backend está en el plan gratis de Render, que se duerme tras un rato sin uso. La primera carga puede tardar ~50 segundos.

## Stack

Node.js + Express · MongoDB (Mongoose) · JWT + bcrypt · Nodemailer.
Arquitectura en capas: `routes → controllers → services → repositories → models`.

## Entidades

- **Contacto** (principal): `nombre, profile_picture, isGroup, fk_usuario`
- **Mensaje** (relacionada): `texto, send_by_me, leido, fk_contacto, fk_usuario, fecha`
- **Comunidad**: `nombre, descripcion, icon, groups[], fk_usuario`
- **User**: `nombre, email, password, email_verificado`

Cada Mensaje referencia a un Contacto (`ref` + `populate`), y todo pertenece a un User.

## Instalación

1. `npm install`
2. Copiá `.env.example` a `.env` y completá `MONGO_DB_CONNECTION_STRING` y `JWT_SECRET` (los datos de Gmail son opcionales, solo para enviar el mail de verificación).
3. `npm run seed` (crea el usuario de prueba con datos de ejemplo).
4. `npm run dev` (corre en `http://localhost:8080`).

## Usuario de prueba (mail ya verificado)

- **Email:** `demianfredes@gmail.com`
- **Password:** `demianfredes1234`

## Endpoints

Las respuestas tienen la forma `{ message, ok, status, data? }`. Las rutas marcadas con 🔒 necesitan el header `Authorization: Bearer <token>`.

**Auth** `/api/auth`
- `POST /register` — `{ nombre, email, password }` — registra y envía el mail de verificación.
- `GET /verify-email?verification_token=...` — verifica la cuenta.
- `POST /login` — `{ email, password }` — devuelve `{ token, user }`.
- `GET /me` 🔒 — datos del usuario logueado.
- `PUT /me` 🔒 — `{ nombre }` — edita el nombre del perfil.

**Contactos** `/api/contactos` 🔒
- `GET /` · `GET /:id` — listar / ver.
- `POST /` — `{ nombre, profile_picture? }` — crear.
- `PUT /:id` — editar.
- `DELETE /:id` — borrar (con sus mensajes).

**Mensajes** `/api/mensajes` 🔒
- `GET /?contactoId=...` — mensajes de un contacto.
- `POST /` — `{ texto, contactoId }` — enviar.
- `DELETE /vaciar/:contactoId` — vaciar el chat.

**Comunidades** `/api/comunidades` 🔒
- `GET /` · `GET /:id` — listar / ver.
- `POST /` — `{ nombre, descripcion? }` — crear.
- `PUT /:id` — editar.
- `DELETE /:id` — borrar.

También está la colección `postman_collection.json` (en la raíz) para probar la API: importala en Postman, corré Login y pegá el `token` en la variable de la colección.

## Deploy

Backend en Render, frontend en Vercel, base de datos en MongoDB Atlas.
