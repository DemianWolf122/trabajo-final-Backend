import comunidadService from '../services/comunidad.service.js'

class ComunidadController {
    async getAll(req, res, next) {
        try {
            const comunidades = await comunidadService.getAll(req.user.id)
            return res.status(200).json({ message: 'Comunidades obtenidas', ok: true, status: 200, data: { comunidades } })
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const comunidad = await comunidadService.getById(req.params.id, req.user.id)
            return res.status(200).json({ message: 'Comunidad obtenida', ok: true, status: 200, data: { comunidad } })
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const comunidad = await comunidadService.create(req.body, req.user.id)
            return res.status(201).json({ message: 'Comunidad creada', ok: true, status: 201, data: { comunidad } })
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const comunidad = await comunidadService.update(req.params.id, req.body, req.user.id)
            return res.status(200).json({ message: 'Comunidad actualizada', ok: true, status: 200, data: { comunidad } })
        } catch (error) {
            next(error)
        }
    }

    async remove(req, res, next) {
        try {
            await comunidadService.remove(req.params.id, req.user.id)
            return res.status(200).json({ message: 'Comunidad eliminada', ok: true, status: 200 })
        } catch (error) {
            next(error)
        }
    }
}

const comunidadController = new ComunidadController()
export default comunidadController
