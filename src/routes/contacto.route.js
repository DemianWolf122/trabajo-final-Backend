import { Router } from 'express'
import contactoController from '../controllers/contacto.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import validateFields from '../middleware/validate.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', contactoController.getAll)
router.get('/:id', contactoController.getById)
router.post('/', validateFields(['nombre']), contactoController.create)
router.put('/:id', contactoController.update)
router.delete('/:id', contactoController.remove)

export default router
