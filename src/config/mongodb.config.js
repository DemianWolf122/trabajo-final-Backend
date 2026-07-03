import mongoose from 'mongoose'
import dns from 'dns'
import ENVIRONMENT from './environment.config.js'

const connectMongoDB = async () => {
    try {
        const baseUri = (ENVIRONMENT.MONGO_DB_CONNECTION_STRING || '').trim()
        const dbName = (ENVIRONMENT.MONGO_DB_NAME || '').trim()

        if (!baseUri) throw new Error('Falta MONGO_DB_CONNECTION_STRING en el .env')
        if (!baseUri.startsWith('mongodb://') && !baseUri.startsWith('mongodb+srv://'))
            throw new Error('El URI debe iniciar con mongodb:// o mongodb+srv://')

        if (ENVIRONMENT.MODE === 'development') dns.setServers(['8.8.8.8', '8.8.4.4'])

        const uri = dbName ? `${baseUri.replace(/\/$/, '')}/${dbName}` : baseUri
        await mongoose.connect(uri)
        console.log('La conexion con MongoDB funciona')
    } catch (error) {
        console.error('Fallo en la conexion de la DB', error)
        throw error
    }
}

export default connectMongoDB
