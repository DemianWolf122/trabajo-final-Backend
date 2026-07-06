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
        // Nate Gentile — hardware
        { texto: 'Che, ¿viste los rumores de las nuevas RTX 5090?', send_by_me: false, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(60) },
        { texto: '¡Una locura total! Pero hay que vender un riñón y medio para armar ese setup.', send_by_me: true, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(55) },
        { texto: 'Totalmente. Mañana me llega una de ensamble, sale video con refrigeración custom sí o sí.', send_by_me: false, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(50) },
        { texto: '¡Avisá cuando lo subas!', send_by_me: true, leido: true, fk_contacto: nate._id, fk_usuario: userId, fecha: t(45) },
        { texto: 'Obvio, le voy a meter tubos rígidos de acrílico.', send_by_me: false, leido: false, fk_contacto: nate._id, fk_usuario: userId, fecha: t(44) },

        // Suprapixel — audio
        { texto: 'Buenas! ¿Pudiste probar los auriculares Sony que te mandé?', send_by_me: false, leido: true, fk_contacto: supra._id, fk_usuario: userId, fecha: t(120) },
        { texto: 'Sí Nico, el ANC que tienen es increíble, te aísla de todo el ruido del bondi.', send_by_me: true, leido: true, fk_contacto: supra._id, fk_usuario: userId, fecha: t(115) },

        // Midudev — programación
        { texto: '¡Hola! ¿Cómo venís con el curso de React?', send_by_me: false, leido: true, fk_contacto: midu._id, fk_usuario: userId, fecha: t(180) },
        { texto: 'Hola Midu! Remando un poco con los Hooks, pero armando un clon re cheto.', send_by_me: true, leido: true, fk_contacto: midu._id, fk_usuario: userId, fecha: t(175) },

        // DevTalles — grupo (con sender_name)
        { texto: 'Gente, subí un nuevo video sobre Node.js y Supabase.', send_by_me: false, leido: true, sender_name: 'Fazt', fk_contacto: devtalles._id, fk_usuario: userId, fecha: t(240) },
        { texto: '¡Ufff me viene de diez para el backend de mi proyecto final!', send_by_me: true, leido: true, fk_contacto: devtalles._id, fk_usuario: userId, fecha: t(235) },
        { texto: '¿Alguien sabe si Supabase soporta triggers de Postgres nativos?', send_by_me: false, leido: false, sender_name: 'UsuarioRandom123', fk_contacto: devtalles._id, fk_usuario: userId, fecha: t(230) }
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
