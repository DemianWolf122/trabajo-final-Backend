import { Router } from 'express'
import comunidadController from '../controllers/comunidad.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import validateFields, { validateObjectId } from '../middleware/validate.middleware.js'

const router = Router()

router.use(authMiddleware)

const comunidadRules = {
    nombre: { required: true, type: 'string', min: 2, max: 60 },
    descripcion: { type: 'string', max: 200 },
    icon: { type: 'string', max: 500 }
}

router.get('/', comunidadController.getAll)
router.get('/:id', validateObjectId('id'), comunidadController.getById)
router.post('/', validateFields(comunidadRules), comunidadController.create)
router.put('/:id', validateObjectId('id'), validateFields({ ...comunidadRules, nombre: { ...comunidadRules.nombre, required: false } }), comunidadController.update)
router.delete('/:id', validateObjectId('id'), comunidadController.remove)

export default router
