import contactoRepository from '../repositories/contacto.repository.js'
import mensajeRepository from '../repositories/mensaje.repository.js'
import ServerError from '../utils/ServerError.js'

class ContactoService {
    async getAll(userId) {
        return await contactoRepository.getAllByUser(userId)
    }

    async getById(id, userId) {
        return await this._getOwned(id, userId)
    }

    async create(data, userId) {
        if (!data.nombre || !data.nombre.trim())
            throw new ServerError('El nombre del contacto es requerido', 400)
        return await contactoRepository.create(data, userId)
    }

    async update(id, data, userId) {
        await this._getOwned(id, userId)
        return await contactoRepository.updateById(id, data)
    }

    async remove(id, userId) {
        await this._getOwned(id, userId)
        // Al borrar un contacto tambien borramos sus mensajes.
        await mensajeRepository.deleteAllByContacto(id)
        await contactoRepository.deleteById(id)
    }

    async _getOwned(id, userId) {
        const contacto = await contactoRepository.getById(id)
        if (!contacto) throw new ServerError('Contacto no encontrado', 404)
        if (String(contacto.fk_usuario) !== String(userId))
            throw new ServerError('No tenes permiso sobre este contacto', 403)
        return contacto
    }
}

const contactoService = new ContactoService()
export default contactoService
