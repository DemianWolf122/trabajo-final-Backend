import { Router } from 'express'
import authController from '../controllers/auth.controller.js'
import validateFields from '../middleware/validate.middleware.js'

const router = Router()

router.post('/register', validateFields(['nombre', 'email', 'password']), authController.register)
router.get('/verify-email', authController.verifyEmail)
router.post('/login', validateFields(['email', 'password']), authController.login)
router.post('/guest', authController.guestLogin)

export default router
