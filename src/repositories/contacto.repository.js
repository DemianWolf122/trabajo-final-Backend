import Contacto from '../models/contacto.model.js'

class ContactoRepository {
    async getAllByUser(userId) {
        return await Contacto.find({ fk_usuario: userId }).sort({ fecha_creacion: 1 })
    }

    async getById(id) {
        return await Contacto.findById(id)
    }

    async create(data, userId) {
        return await Contacto.create({ ...data, fk_usuario: userId })
    }

    async updateById(id, data) {
        return await Contacto.findByIdAndUpdate(id, data, { new: true })
    }

    async deleteById(id) {
        return await Contacto.findByIdAndDelete(id)
    }
}

const contactoRepository = new ContactoRepository()
export default contactoRepository
