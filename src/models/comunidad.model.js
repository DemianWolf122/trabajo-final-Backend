import mongoose from 'mongoose'

// Cada grupo dentro de una comunidad (subdocumento).
const grupoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    unread: { type: Number, default: 0 }
}, { _id: true })

// Entidad extra: una comunidad (grupo de chats) que pertenece a un usuario.
const comunidadSchema = new mongoose.Schema({
    nombre:         { type: String, required: true },
    descripcion:    { type: String, default: '' },
    icon:           { type: String, default: '' },
    groups:         { type: [grupoSchema], default: [] },
    fk_usuario:     { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    fecha_creacion: { type: Date, required: true, default: Date.now }
})

const Comunidad = mongoose.model('Comunidad', comunidadSchema)
export default Comunidad
