import { Router } from 'express'
import mensajeController from '../controllers/mensaje.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import validateFields from '../middleware/validate.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', mensajeController.getByContacto)                         // /api/mensajes?contactoId=...
router.post('/', validateFields(['texto', 'contactoId']), mensajeController.create)
router.delete('/vaciar/:contactoId', mensajeController.vaciarChat)       // vaciar todo el chat
router.delete('/:id', mensajeController.remove)                         // borrar un mensaje

export default router
