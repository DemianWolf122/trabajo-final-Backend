import mongoose from 'mongoose'
import ServerError from '../utils/ServerError.js'

// Chequea que el id de la ruta o query sea un ObjectId valido antes de buscar en la base.
export const validateObjectId = (paramName, source = 'params') => (req, res, next) => {
    const value = req[source][paramName]
    if (!value || !mongoose.isValidObjectId(value))
        return next(new ServerError(`El parametro "${paramName}" no es un ID valido`, 400))
    next()
}

// Valida los campos del body: si son requeridos, el tipo, el largo (min/max) y el formato (regex).
const validateFields = (rules) => (req, res, next) => {
    // Si me pasan solo una lista de nombres, los tomo como requeridos.
    if (Array.isArray(rules)) {
        rules = Object.fromEntries(rules.map(f => [f, { required: true }]))
    }

    for (const [field, rule] of Object.entries(rules)) {
        const value = req.body[field]
        const vacio = value === undefined || value === null || value === ''

        if (rule.required && vacio)
            return next(new ServerError(`El campo "${field}" es requerido`, 400))

        // Si el campo no vino y no es requerido, no hay nada mas que validar.
        if (vacio) continue

        if (rule.type === 'string' && typeof value !== 'string')
            return next(new ServerError(`El campo "${field}" debe ser un texto`, 400))
        if (rule.type === 'boolean' && typeof value !== 'boolean')
            return next(new ServerError(`El campo "${field}" debe ser true o false`, 400))
        if (rule.type === 'number' && typeof value !== 'number')
            return next(new ServerError(`El campo "${field}" debe ser un numero`, 400))

        if (typeof value === 'string') {
            if (rule.min && value.trim().length < rule.min)
                return next(new ServerError(`El campo "${field}" debe tener al menos ${rule.min} caracteres`, 400))
            if (rule.max && value.trim().length > rule.max)
                return next(new ServerError(`El campo "${field}" no puede superar los ${rule.max} caracteres`, 400))
            if (rule.regex && !rule.regex.test(value))
                return next(new ServerError(rule.regexMsg || `El campo "${field}" tiene un formato invalido`, 400))
        }
    }
    next()
}

export default validateFields
