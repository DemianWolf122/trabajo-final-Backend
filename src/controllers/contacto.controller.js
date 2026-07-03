import contactoService from '../services/contacto.service.js'

class ContactoController {
    async getAll(req, res, next) {
        try {
            const contactos = await contactoService.getAll(req.user.id)
            return res.status(200).json({ message: 'Contactos obtenidos', ok: true, status: 200, data: { contactos } })
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const contacto = await contactoService.getById(req.params.id, req.user.id)
            return res.status(200).json({ message: 'Contacto obtenido', ok: true, status: 200, data: { contacto } })
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const contacto = await contactoService.create(req.body, req.user.id)
            return res.status(201).json({ message: 'Contacto creado', ok: true, status: 201, data: { contacto } })
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const contacto = await contactoService.update(req.params.id, req.body, req.user.id)
            return res.status(200).json({ message: 'Contacto actualizado', ok: true, status: 200, data: { contacto } })
        } catch (error) {
            next(error)
        }
    }

    async remove(req, res, next) {
        try {
            await contactoService.remove(req.params.id, req.user.id)
            return res.status(200).json({ message: 'Contacto eliminado', ok: true, status: 200 })
        } catch (error) {
            next(error)
        }
    }
}

const contactoController = new ContactoController()
export default contactoController
