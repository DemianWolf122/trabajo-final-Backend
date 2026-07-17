import authService from '../services/auth.service.js'
import ServerError from '../utils/ServerError.js'

class AuthController {
    async register(req, res, next) {
        try {
            const { nombre, email, password } = req.body
            const baseUrl = `${req.protocol}://${req.get('host')}`
            const user = await authService.register(nombre, email, password, baseUrl)
            return res.status(201).json({
                message: 'Usuario registrado con exito. Revisa tu mail para verificar la cuenta.',
                ok: true,
                status: 201,
                data: { user }
            })
        } catch (error) {
            next(error)
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { verification_token } = req.query
            if (!verification_token) throw new ServerError('Falta el token de verificacion', 400)

            await authService.verifyEmail(verification_token)
            return res.status(200).json({
                message: 'Email verificado correctamente. Ya podes iniciar sesion.',
                ok: true,
                status: 200
            })
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const { token, user } = await authService.login(email, password)
            return res.status(200).json({
                message: 'Login exitoso',
                ok: true,
                status: 200,
                data: { token, user }
            })
        } catch (error) {
            next(error)
        }
    }

    // Perfil del usuario logueado (protegido por authMiddleware)
    async me(req, res, next) {
        try {
            const user = await authService.getPerfil(req.user.id)
            return res.status(200).json({ message: 'Perfil obtenido', ok: true, status: 200, data: { user } })
        } catch (error) {
            next(error)
        }
    }

    async updateMe(req, res, next) {
        try {
            const user = await authService.updatePerfil(req.user.id, req.body)
            return res.status(200).json({ message: 'Perfil actualizado', ok: true, status: 200, data: { user } })
        } catch (error) {
            next(error)
        }
    }
}

const authController = new AuthController()
export default authController
