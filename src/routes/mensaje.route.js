import { Router } from 'express'
import mensajeController from '../controllers/mensaje.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import validateFields, { validateObjectId } from '../middleware/validate.middleware.js'

const router = Router()

router.use(authMiddleware)

// Reglas de validacion para crear mensajes
const mensajeRules = {
    texto: { required: true, type: 'string', min: 1, max: 2000 },
    contactoId: { required: true, type: 'string' },
    send_by_me: { type: 'boolean' },
    leido: { type: 'boolean' }
}

router.get('/', validateObjectId('contactoId', 'query'), mensajeController.getByContacto)   // /api/mensajes?contactoId=...
router.post('/', validateFields(mensajeRules), validateObjectId('contactoId', 'body'), mensajeController.create)
router.put('/leer/:contactoId', validateObjectId('contactoId'), mensajeController.marcarLeidos)
router.delete('/vaciar/:contactoId', validateObjectId('contactoId'), mensajeController.vaciarChat)
router.delete('/:id', validateObjectId('id'), mensajeController.remove)

export default router
