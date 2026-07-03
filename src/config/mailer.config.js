import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

// El mailer es opcional: si no hay credenciales de Gmail en el .env, la app
// igual funciona (el link de verificacion se loguea/devuelve en vez de enviarse).
export const isMailerConfigured = Boolean(ENVIRONMENT.GMAIL_USERNAME && ENVIRONMENT.GMAIL_PASSWORD)

const mailer_transport = isMailerConfigured
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENVIRONMENT.GMAIL_USERNAME,
            pass: ENVIRONMENT.GMAIL_PASSWORD
        }
    })
    : null

export default mailer_transport
