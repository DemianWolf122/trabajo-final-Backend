import mensajeRepository from '../repositories/mensaje.repository.js'
import contactoRepository from '../repositories/contacto.repository.js'
import ServerError from '../utils/ServerError.js'

class MensajeService {
    async getByContacto(contactoId, userId) {
        await this._assertContactoDelUsuario(contactoId, userId)
        return await mensajeRepository.getAllByContacto(contactoId)
    }

    async create(data, userId) {
        const { texto, contactoId } = data
        if (!texto || !texto.trim()) throw new ServerError('El texto del mensaje es requerido', 400)
        if (!contactoId) throw new ServerError('Falta el contacto del mensaje', 400)

        await this._assertContactoDelUsuario(contactoId, userId)

        return await mensajeRepository.create({
            texto,
            send_by_me: data.send_by_me !== undefined ? data.send_by_me : true,
            leido: data.leido !== undefined ? data.leido : false,
            fk_contacto: contactoId
        }, userId)
    }

    async vaciarChat(contactoId, userId) {
        await this._assertContactoDelUsuario(contactoId, userId)
        await mensajeRepository.deleteAllByContacto(contactoId)
    }

    async remove(id, userId) {
        const mensaje = await mensajeRepository.getById(id)
        if (!mensaje) throw new ServerError('Mensaje no encontrado', 404)
        if (String(mensaje.fk_usuario) !== String(userId))
            throw new ServerError('No tenes permiso sobre este mensaje', 403)
        await mensajeRepository.deleteById(id)
    }

    async _assertContactoDelUsuario(contactoId, userId) {
        const contacto = await contactoRepository.getById(contactoId)
        if (!contacto) throw new ServerError('El contacto no existe', 404)
        if (String(contacto.fk_usuario) !== String(userId))
            throw new ServerError('No tenes permiso sobre este contacto', 403)
    }
}

const mensajeService = new MensajeService()
export default mensajeService
