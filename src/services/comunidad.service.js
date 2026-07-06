import comunidadRepository from '../repositories/comunidad.repository.js'
import ServerError from '../utils/ServerError.js'

class ComunidadService {
    // Campos que el cliente puede modificar en un update (nunca el objeto entero).
    static CAMPOS_EDITABLES = ['nombre', 'descripcion', 'icon', 'groups']

    async getAll(userId) {
        return await comunidadRepository.getAllByUser(userId)
    }

    async getById(id, userId) {
        return await this._getOwned(id, userId)
    }

    async create(data, userId) {
        if (!data.nombre || !data.nombre.trim())
            throw new ServerError('El nombre de la comunidad es requerido', 400)

        const nueva = {
            nombre: data.nombre.trim(),
            descripcion: data.descripcion || '',
            icon: data.icon || '',
            groups: Array.isArray(data.groups)
                ? data.groups.filter(g => g && g.nombre).map(g => ({ nombre: String(g.nombre).trim(), unread: 0 }))
                : []
        }
        return await comunidadRepository.create(nueva, userId)
    }

    async update(id, data, userId) {
        await this._getOwned(id, userId)

        const cambios = {}
        for (const campo of ComunidadService.CAMPOS_EDITABLES) {
            if (data[campo] !== undefined) cambios[campo] = data[campo]
        }
        if (Object.keys(cambios).length === 0)
            throw new ServerError('No se envio ningun campo valido para actualizar', 400)

        return await comunidadRepository.updateById(id, cambios)
    }

    async remove(id, userId) {
        await this._getOwned(id, userId)
        await comunidadRepository.deleteById(id)
    }

    async _getOwned(id, userId) {
        const comunidad = await comunidadRepository.getById(id)
        if (!comunidad) throw new ServerError('Comunidad no encontrada', 404)
        if (String(comunidad.fk_usuario) !== String(userId))
            throw new ServerError('No tenes permiso sobre esta comunidad', 403)
        return comunidad
    }
}

const comunidadService = new ComunidadService()
export default comunidadService
