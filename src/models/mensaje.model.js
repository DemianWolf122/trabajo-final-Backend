import mongoose from 'mongoose'

// Entidad RELACIONADA: cada mensaje pertenece a un contacto (ref + populate) y a un usuario.
const mensajeSchema = new mongoose.Schema({
    texto:        { type: String, required: true },
    send_by_me:   { type: Boolean, required: true, default: true }, // true = lo mandó el usuario logueado
    leido:        { type: Boolean, required: true, default: false },
    sender_name:  { type: String, default: '' }, // nombre del emisor en chats de grupo
    fk_contacto:  { type: mongoose.Schema.ObjectId, required: true, ref: 'Contacto' },
    fk_usuario:   { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    fecha:        { type: Date, required: true, default: Date.now }
})

const Mensaje = mongoose.model('Mensaje', mensajeSchema)
export default Mensaje
