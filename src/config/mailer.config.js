import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

// El mailer es opcional: si no hay credenciales de Gmail en el .env, la app
// igual funciona (el link de verificacion se loguea/devuelve en vez de enviarse).
export const isMailerConfigured = Boolean(ENVIRONMENT.GMAIL_USERNAME && ENVIRONMENT.GMAIL_PASSWORD)

const mailer_transport = isMailerConfigured
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: ENVIRONMENT.GMAIL_USERNAME,
            pass: ENVIRONMENT.GMAIL_PASSWORD
        },
        // Si el servidor de mail no contesta, cortamos rapido para no dejar
        // el registro esperando (algunos hostings bloquean la salida SMTP).
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000
    })
    : null

export default mailer_transport
