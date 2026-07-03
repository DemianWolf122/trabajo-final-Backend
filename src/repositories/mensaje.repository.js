import Mensaje from '../models/mensaje.model.js'

class MensajeRepository {
    async getAllByContacto(contactoId) {
        return await Mensaje.find({ fk_contacto: contactoId })
            .sort({ fecha: 1 })
            .populate('fk_contacto', 'nombre profile_picture')
    }

    async getById(id) {
        return await Mensaje.findById(id)
    }

    async create(data, userId) {
        const mensaje = await Mensaje.create({ ...data, fk_usuario: userId })
        return await mensaje.populate('fk_contacto', 'nombre profile_picture')
    }

    async deleteById(id) {
        return await Mensaje.findByIdAndDelete(id)
    }

    async deleteAllByContacto(contactoId) {
        return await Mensaje.deleteMany({ fk_contacto: contactoId })
    }
}

const mensajeRepository = new MensajeRepository()
export default mensajeRepository
