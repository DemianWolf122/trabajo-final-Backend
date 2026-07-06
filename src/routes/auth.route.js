import { Router } from 'express'
import authController from '../controllers/auth.controller.js'
import validateFields from '../middleware/validate.middleware.js'

const router = Router()

const EMAIL_REGEX = /^\S+@\S+\.\S+$/

router.post('/register', validateFields({
    nombre: { required: true, type: 'string', min: 3, max: 50 },
    email: { required: true, type: 'string', max: 100, regex: EMAIL_REGEX, regexMsg: 'El email tiene un formato invalido' },
    password: { required: true, type: 'string', min: 6, max: 72 }
}), authController.register)

router.get('/verify-email', authController.verifyEmail)

router.post('/login', validateFields({
    email: { required: true, type: 'string', regex: EMAIL_REGEX, regexMsg: 'El email tiene un formato invalido' },
    password: { required: true, type: 'string' }
}), authController.login)

router.post('/guest', authController.guestLogin)

export default router
