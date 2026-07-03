import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../utils/ServerError.js'

const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header || !header.startsWith('Bearer '))
            throw new ServerError('Falta el token de autenticacion', 401)

        const token = header.split(' ')[1]
        const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET)
        req.user = payload
        next()
    } catch (error) {
        next(new ServerError('Token invalido o expirado', 401))
    }
}

export default authMiddleware
