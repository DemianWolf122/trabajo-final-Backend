import mongoose from 'mongoose'

// Entidad PRINCIPAL: un contacto/chat que pertenece a un usuario.
const contactoSchema = new mongoose.Schema({
    nombre:          { type: String, required: true },
    profile_picture: { type: String, default: '' },
    isGroup:         { type: Boolean, default: false },
    fk_usuario:      { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    fecha_creacion:  { type: Date, required: true, default: Date.now }
})

const Contacto = mongoose.model('Contacto', contactoSchema)
export default Contacto
