import Comunidad from '../models/comunidad.model.js'

class ComunidadRepository {
    async getAllByUser(userId) {
        return await Comunidad.find({ fk_usuario: userId }).sort({ fecha_creacion: 1 })
    }

    async getById(id) {
        return await Comunidad.findById(id)
    }

    async create(data, userId) {
        return await Comunidad.create({ ...data, fk_usuario: userId })
    }

    async updateById(id, data) {
        return await Comunidad.findByIdAndUpdate(id, data, { new: true })
    }

    async deleteById(id) {
        return await Comunidad.findByIdAndDelete(id)
    }
}

const comunidadRepository = new ComunidadRepository()
export default comunidadRepository
