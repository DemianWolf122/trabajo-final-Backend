import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import connectMongoDB from './config/mongodb.config.js'
import User from './models/user.model.js'
import Contacto from './models/contacto.model.js'
import Mensaje from './models/mensaje.model.js'
import Comunidad from './models/comunidad.model.js'
import { crearDatosDeEjemplo } from './data/defaultData.js'

const DEMO = { nombre: 'demianfredes', email: 'demianfredes@gmail.com', password: 'demianfredes1234' }

const seed = async () => {
    try {
        await connectMongoDB()

        // Borramos el/los usuario/s demo de antes con todos sus datos y lo recreamos de cero.
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

        // Contactos + conversaciones + comunidades de ejemplo
        await crearDatosDeEjemplo(user._id)

        console.log('\n✅ Seed completado.')
        console.log(`   Usuario demo:  ${DEMO.email}`)
        console.log(`   Password:      ${DEMO.password}`)
        console.log('   (mail ya verificado, con contactos, mensajes y comunidades de ejemplo)\n')

        await mongoose.disconnect()
        process.exit(0)
    } catch (error) {
        console.error('Fallo el seed:', error)
        process.exit(1)
    }
}

seed()
