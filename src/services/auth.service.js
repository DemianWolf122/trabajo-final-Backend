import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userRepository from '../repositories/user.repository.js'
import mailer_transport, { isMailerConfigured } from '../config/mailer.config.js'
import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../utils/ServerError.js'
import { crearDatosDeEjemplo } from '../data/defaultData.js'

class AuthService {
    async register(nombre, email, password, baseUrl) {
        if (!nombre || nombre.length <= 2)
            throw new ServerError('El nombre debe tener mas de 2 caracteres', 400)
        if (!email || !/^\S+@\S+\.\S+$/.test(email))
            throw new ServerError('Email invalido', 400)
        if (!password || password.length < 6)
            throw new ServerError('El password debe tener al menos 6 caracteres', 400)

        const existingUser = await userRepository.getByEmail(email)
        if (existingUser) throw new ServerError('El email ya esta registrado', 400)

        const hashed_password = await bcrypt.hash(password, 12)
        const newUser = await userRepository.create(nombre, email, hashed_password)

        // Cada usuario nuevo arranca con contactos, conversaciones y comunidades de ejemplo,
        // así cada apartado tiene contenido por default.
        await crearDatosDeEjemplo(newUser._id)

        const verification_token = jwt.sign({ email }, ENVIRONMENT.JWT_SECRET, { expiresIn: '1d' })
        // Si URL_BACKEND no esta en el .env, uso la URL con la que llego el pedido.
        const base = ENVIRONMENT.URL_BACKEND || baseUrl
        const verification_url = `${base}/api/auth/verify-email?verification_token=${verification_token}`

        if (isMailerConfigured) {
            await mailer_transport.sendMail({
                from: ENVIRONMENT.GMAIL_USERNAME,
                to: email,
                subject: 'Verifica tu mail - Chat App',
                html: `<h1>Bienvenido/a, ${nombre}!</h1>
                       <p>Hace click en el siguiente link para verificar tu cuenta:</p>
                       <a href="${verification_url}">Verificar mi cuenta</a>`
            })
        } else {
            console.log(`\n[MAILER NO CONFIGURADO] Link de verificacion para ${email}:\n${verification_url}\n`)
        }

        const result = { id: newUser._id, nombre: newUser.nombre, email: newUser.email }
        if (!isMailerConfigured) result.verification_url = verification_url
        return result
    }

    async verifyEmail(verification_token) {
        let payload
        try {
            payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
        } catch (error) {
            throw new ServerError('Token de verificacion invalido o expirado', 400)
        }

        const user = await userRepository.getByEmail(payload.email)
        if (!user) throw new ServerError('Usuario no encontrado', 404)
        if (user.email_verificado) throw new ServerError('Este email ya fue verificado', 400)

        await userRepository.updateById(user._id, { email_verificado: true })
    }

    async login(email, password) {
        if (!email || !password) throw new ServerError('Email y password son requeridos', 400)

        const user = await userRepository.getByEmail(email)
        if (!user) throw new ServerError('Credenciales invalidas', 401)

        const passwordOk = await bcrypt.compare(password, user.password)
        if (!passwordOk) throw new ServerError('Credenciales invalidas', 401)

        if (!user.email_verificado) throw new ServerError('Debes verificar tu email antes de iniciar sesion', 403)

        return this._buildSession(user)
    }

    // Perfil del usuario logueado (sin exponer el password).
    async getPerfil(userId) {
        const user = await userRepository.getById(userId)
        if (!user) throw new ServerError('Usuario no encontrado', 404)
        return this._publicUser(user)
    }

    // Actualiza el perfil. Solo se permite cambiar el nombre (whitelist);
    // el email no se cambia acá porque implicaria re-verificar la cuenta.
    async updatePerfil(userId, data) {
        const user = await userRepository.getById(userId)
        if (!user) throw new ServerError('Usuario no encontrado', 404)

        const cambios = {}
        if (data.nombre !== undefined) {
            if (typeof data.nombre !== 'string' || data.nombre.trim().length < 3)
                throw new ServerError('El nombre debe tener al menos 3 caracteres', 400)
            cambios.nombre = data.nombre.trim()
        }
        if (Object.keys(cambios).length === 0)
            throw new ServerError('No se envio ningun campo valido para actualizar', 400)

        const actualizado = await userRepository.updateById(userId, cambios)
        return this._publicUser(actualizado)
    }

    _publicUser(user) {
        return { id: user._id, nombre: user.nombre, email: user.email, email_verificado: user.email_verificado, fecha_creacion: user.fecha_creacion }
    }

    _buildSession(user) {
        const token = jwt.sign({ id: user._id, email: user.email }, ENVIRONMENT.JWT_SECRET, {
            expiresIn: ENVIRONMENT.JWT_EXPIRES_IN
        })
        return { token, user: { id: user._id, nombre: user.nombre, email: user.email } }
    }
}

const authService = new AuthService()
export default authService
