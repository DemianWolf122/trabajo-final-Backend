import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import connectMongoDB from './config/mongodb.config.js'
import User from './models/user.model.js'
import Contacto from './models/contacto.model.js'
import Mensaje from './models/mensaje.model.js'

const DEMO = { nombre: 'Demian Wolf', email: 'demo@chat.com', password: 'ChatApp2026' }

const seed = async () => {
    try {
        await connectMongoDB()

        // Idempotente: si ya existe el demo, lo borramos junto a sus datos y lo recreamos limpio.
        const anterior = await User.findOne({ email: DEMO.email })
        if (anterior) {
            const contactos = await Contacto.find({ fk_usuario: anterior._id })
            await Mensaje.deleteMany({ fk_usuario: anterior._id })
            await Contacto.deleteMany({ fk_usuario: anterior._id })
            await User.deleteOne({ _id: anterior._id })
        }

        const hashed_password = await bcrypt.hash(DEMO.password, 12)
        const user = await User.create({
            nombre: DEMO.nombre,
            email: DEMO.email,
            password: hashed_password,
            email_verificado: true
        })

        // Contactos de ejemplo
        const nate = await Contacto.create({ nombre: 'Nate Gentile', profile_picture: 'https://unavatar.io/youtube/nategentile7', fk_usuario: user._id })
        const midu = await Contacto.create({ nombre: 'Midudev', profile_picture: 'https://unavatar.io/github/midudev', fk_usuario: user._id })
        await Contacto.create({ nombre: 'Suprapixel', profile_picture: 'https://unavatar.io/youtube/SupraPixel', fk_usuario: user._id })

        // Mensajes de ejemplo (relacionados a los contactos)
        await Mensaje.create([
            { texto: 'Che, ¿viste los rumores de las nuevas RTX 5090?', send_by_me: false, leido: true, fk_contacto: nate._id, fk_usuario: user._id },
            { texto: '¡Una locura total! Pero hay que vender un riñón para armar ese setup.', send_by_me: true, leido: true, fk_contacto: nate._id, fk_usuario: user._id },
            { texto: 'Totalmente. Mañana me llega una de ensamble, sale video sí o sí.', send_by_me: false, leido: true, fk_contacto: nate._id, fk_usuario: user._id },
            { texto: '¡Hola! ¿Cómo venís con el curso de React?', send_by_me: false, leido: true, fk_contacto: midu._id, fk_usuario: user._id },
            { texto: 'Hola Midu! Remando un poco con los Hooks, pero armando un clon re cheto.', send_by_me: true, leido: true, fk_contacto: midu._id, fk_usuario: user._id }
        ])

        console.log('\n✅ Seed completado.')
        console.log(`   Usuario demo:  ${DEMO.email}`)
        console.log(`   Password:      ${DEMO.password}`)
        console.log('   (mail ya verificado, con contactos y mensajes de ejemplo)\n')

        await mongoose.disconnect()
        process.exit(0)
    } catch (error) {
        console.error('Fallo el seed:', error)
        process.exit(1)
    }
}

seed()
