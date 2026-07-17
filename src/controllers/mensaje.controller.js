import mensajeService from '../services/mensaje.service.js'
import ServerError from '../utils/ServerError.js'

class MensajeController {
    async getByContacto(req, res, next) {
        try {
            const { contactoId } = req.query
            if (!contactoId) throw new ServerError('Falta el parametro contactoId', 400)
            const mensajes = await mensajeService.getByContacto(contactoId, req.user.id)
            return res.status(200).json({ message: 'Mensajes obtenidos', ok: true, status: 200, data: { mensajes } })
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const mensaje = await mensajeService.create(req.body, req.user.id)
            return res.status(201).json({ message: 'Mensaje enviado', ok: true, status: 201, data: { mensaje } })
        } catch (error) {
            next(error)
        }
    }

    async vaciarChat(req, res, next) {
        try {
            await mensajeService.vaciarChat(req.params.contactoId, req.user.id)
            return res.status(200).json({ message: 'Chat vaciado', ok: true, status: 200 })
        } catch (error) {
            next(error)
        }
    }

    async marcarLeidos(req, res, next) {
        try {
            await mensajeService.marcarLeidos(req.params.contactoId, req.user.id)
            return res.status(200).json({ message: 'Mensajes marcados como leidos', ok: true, status: 200 })
        } catch (error) {
            next(error)
        }
    }

    async remove(req, res, next) {
        try {
            await mensajeService.remove(req.params.id, req.user.id)
            return res.status(200).json({ message: 'Mensaje eliminado', ok: true, status: 200 })
        } catch (error) {
            next(error)
        }
    }
}

const mensajeController = new MensajeController()
export default mensajeController
