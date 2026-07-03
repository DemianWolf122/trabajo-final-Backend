import express from 'express'
import cors from 'cors'
import ENVIRONMENT from './src/config/environment.config.js'
import connectMongoDB from './src/config/mongodb.config.js'
import authRouter from './src/routes/auth.route.js'
import contactoRouter from './src/routes/contacto.route.js'
import mensajeRouter from './src/routes/mensaje.route.js'
import errorMiddleware from './src/middleware/error.middleware.js'

const startApp = async () => {
    await connectMongoDB()

    const app = express()

    app.use(cors())
    app.use(express.json())

    // Ruta raíz: mensaje de bienvenida con el índice de endpoints de la API.
    app.get('/', (req, res) => {
        return res.status(200).json({
            message: 'API de Chat App funcionando 🚀',
            ok: true,
            status: 200,
            endpoints: {
                auth: {
                    register: 'POST /api/auth/register',
                    verifyEmail: 'GET /api/auth/verify-email?verification_token=...',
                    login: 'POST /api/auth/login',
                    guest: 'POST /api/auth/guest'
                },
                contactos: 'GET|POST /api/contactos , GET|PUT|DELETE /api/contactos/:id  (requiere token)',
                mensajes: 'GET /api/mensajes?contactoId=... , POST /api/mensajes , DELETE /api/mensajes/vaciar/:contactoId  (requiere token)'
            }
        })
    })

    app.use('/api/auth', authRouter)
    app.use('/api/contactos', contactoRouter)
    app.use('/api/mensajes', mensajeRouter)

    app.use(errorMiddleware)

    app.listen(ENVIRONMENT.PORT, () => {
        console.log(`Servidor de Chat App corriendo en el puerto ${ENVIRONMENT.PORT}`)
    })
}

startApp()
