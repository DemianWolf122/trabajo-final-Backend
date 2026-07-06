import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import connectMongoDB from './config/mongodb.config.js'
import User from './models/user.model.js'
import Contacto from './models/contacto.model.js'
import Mensaje from './models/mensaje.model.js'
import Comunidad from './models/comunidad.model.js'

const DEMO = { nombre: 'Demian Wolf', email: 'demo@chat.com', password: 'ChatApp2026' }

const seed = async () => {
    try {
        await connectMongoDB()

        // Idempotente: borramos TODOS los usuarios demo (por si quedaron duplicados de seeds
        // anteriores) junto a todos sus datos, y recreamos uno limpio.
        const anteriores = await User.find({ email: DEMO.email })
        for (const u of anteriores) {
            await Mensaje.deleteMany({ fk_usuario: u._id })
            await Contacto.deleteMany({ fk_usuario: u._id })
            await Comunidad.deleteMany({ fk_usuario: u._id })
        }
        await User.deleteMany({ email: DEMO.email })

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

        // Comunidades de ejemplo
        await Comunidad.create([
            {
                nombre: 'UTN Programación Web',
                descripcion: 'Comunidad oficial de alumnos de la UTN. Avisos, dudas y proyectos.',
                icon: 'https://ui-avatars.com/api/?name=UTN&background=0055A4&color=fff&rounded=true',
                groups: [
                    { nombre: 'Avisos Oficiales', unread: 2 },
                    { nombre: 'Dudas Front-End (Martes/Jueves)', unread: 15 },
                    { nombre: 'Off-topic / Memes', unread: 0 }
                ],
                fk_usuario: user._id
            },
            {
                nombre: 'Dev Team',
                descripcion: 'Coordinación y desarrollo de la app web.',
                icon: 'https://ui-avatars.com/api/?name=Dev+Team&background=25D366&color=fff&rounded=true',
                groups: [
                    { nombre: 'General', unread: 0 },
                    { nombre: 'Deploy & DevOps', unread: 1 }
                ],
                fk_usuario: user._id
            }
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
