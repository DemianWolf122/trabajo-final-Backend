import Contacto from '../models/contacto.model.js'
import Mensaje from '../models/mensaje.model.js'
import Comunidad from '../models/comunidad.model.js'

// Crea los datos de ejemplo (contactos + conversaciones personalizadas + comunidades)
// para un usuario. Se usa en el seed (usuario demo) y al registrarse un usuario nuevo,
// para que cada apartado tenga contenido de ejemplo por default.
export const crearDatosDeEjemplo = async (userId) => {
    const base = Date.now()
    // helper: fecha con offset en minutos hacia atrás (para ordenar la conversación)
    const t = (minsAtras) => new Date(base - minsAtras * 60000)

    // --- Contactos con conversaciones personalizadas ---
    const nate = await Contacto.create({ nombre: 'Nate Gentile', profile_picture: 'https://unavatar.io/youtube/nategentile7', fk_usuario: userId })
    const supra = await Contacto.create({ nombre: 'Suprapixel', profile_picture: 'https://unavatar.io/youtube/SupraPixel', fk_usuario: userId })
    const midu = await Contacto.create({ nombre: 'Midudev', profile_picture: 'https://unavatar.io/github/midudev', fk_usuario: userId })
    const devtalles = await Contacto.create({ nombre: 'DevTalles (Fazt)', profile_picture: 'https://unavatar.io/youtube/fazttech', isGroup: true, fk_usuario: userId })

    await Mensaje.create([
        // Nate Gentile — hardware (me habla a mí)
        { texto: 'Hola Demian! ¿Al final te armaste la PC nueva?', send_by_me: false, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(60) },
        { texto: 'Todavía no, estoy juntando para la placa 😅', send_by_me: true, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(55) },
        { texto: 'Dale que las RTX 5090 ya están saliendo, te van a volar la cabeza.', send_by_me: false, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(50) },
        { texto: 'Jaja obvio, apenas la tenga te muestro el setup.', send_by_me: true, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(45) },
        { texto: 'De una Demian, avisame así hacemos un stream juntos.', send_by_me: false, leido: false, fk_contacto: nate._id, fk_usuario: userId, fecha: t(44) },

        // Suprapixel — audio (me habla a mí)
        { texto: 'Demian, ¿probaste los auriculares que te recomendé?', send_by_me: false, leido: true, fk_contacto: supra._id, fk_usuario: userId, fecha: t(120) },
        { texto: 'Sí, una locura el sonido. Gracias por el dato!', send_by_me: true, leido: true, fk_contacto: supra._id, fk_usuario: userId, fecha: t(115) },
        { texto: 'Buenísimo! Cualquier cosa que necesites para grabar, avisame.', send_by_me: false, leido: false, fk_contacto: supra._id, fk_usuario: userId, fecha: t(114) },

        // Midudev — programación (me habla a mí)
        { texto: 'Hola Demian! ¿Cómo va tu proyecto final de React?', send_by_me: false, leido: true, fk_contacto: midu._id, fk_usuario: userId, fecha: t(180) },
        { texto: 'Bien Midu, ya lo tengo casi listo, un clon de WhatsApp.', send_by_me: true, leido: true, fk_contacto: midu._id, fk_usuario: userId, fecha: t(175) },
        { texto: 'Genial! Si querés lo reviso y te tiro feedback.', send_by_me: false, leido: false, fk_contacto: midu._id, fk_usuario: userId, fecha: t(174) },

        // DevTalles — grupo (me nombran)
        { texto: 'Che Demian, subí un video de Node que te puede servir para el back.', send_by_me: false, leido: true, sender_name: 'Fazt', fk_contacto: devtalles._id, fk_usuario: userId, fecha: t(240) },
        { texto: '¡Gracias Fazt! justo estoy con esa parte.', send_by_me: true, leido: true, fk_contacto: devtalles._id, fk_usuario: userId, fecha: t(235) },
        { texto: 'Demian, ¿nos pasás tu repo cuando lo termines?', send_by_me: false, leido: false, sender_name: 'Lucas', fk_contacto: devtalles._id, fk_usuario: userId, fecha: t(230) }
    ])

    // --- Comunidades de ejemplo ---
    const globoUTN = 'https://ui-avatars.com/api/?name=UTN&background=0055A4&color=fff&rounded=true'
    const globoDev = 'https://ui-avatars.com/api/?name=Dev&background=25D366&color=fff&rounded=true'
    await Comunidad.create([
        {
            nombre: 'UTN Programación Web',
            descripcion: 'Comunidad oficial de alumnos de la UTN. Avisos, dudas y proyectos.',
            icon: globoUTN,
            groups: [
                { nombre: 'Avisos Oficiales', unread: 2 },
                { nombre: 'Dudas Front-End (Martes/Jueves)', unread: 15 },
                { nombre: 'Off-topic / Memes', unread: 0 }
            ],
            fk_usuario: userId
        },
        {
            nombre: 'Dev Team',
            descripcion: 'Coordinación estratégica y desarrollo de la app web.',
            icon: globoDev,
            groups: [
                { nombre: 'General', unread: 0 },
                { nombre: 'Deploy & DevOps', unread: 1 },
                { nombre: 'UI/UX Design', unread: 0 }
            ],
            fk_usuario: userId
        }
    ])
}

export default crearDatosDeEjemplo
