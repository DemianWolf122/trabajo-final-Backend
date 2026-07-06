import { Router } from 'express'
import contactoController from '../controllers/contacto.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import validateFields, { validateObjectId } from '../middleware/validate.middleware.js'

const router = Router()

router.use(authMiddleware)

// Reglas de validacion para crear/editar contactos
const contactoRules = {
    nombre: { required: true, type: 'string', min: 2, max: 50 },
    profile_picture: { type: 'string', max: 500 },
    isGroup: { type: 'boolean' }
}

router.get('/', contactoController.getAll)
router.get('/:id', validateObjectId('id'), contactoController.getById)
router.post('/', validateFields(contactoRules), contactoController.create)
router.put('/:id', validateObjectId('id'), validateFields({ ...contactoRules, nombre: { ...contactoRules.nombre, required: false } }), contactoController.update)
router.delete('/:id', validateObjectId('id'), contactoController.remove)

export default router
