import mongoose from 'mongoose'
import ServerError from '../utils/ServerError.js'

// Valida que un parametro de ruta o de query sea un ObjectId valido de MongoDB.
// Evita consultar la base con IDs malformados (CastError).
export const validateObjectId = (paramName, source = 'params') => (req, res, next) => {
    const value = req[source][paramName]
    if (!value || !mongoose.isValidObjectId(value))
        return next(new ServerError(`El parametro "${paramName}" no es un ID valido`, 400))
    next()
}

// Middleware factory: valida los campos del body segun reglas.
// Reglas soportadas por campo:
//   required (bool) - el campo debe venir y no estar vacio
//   type ('string'|'boolean'|'number') - tipo de dato esperado
//   min / max (number) - longitud minima/maxima para strings
//   regex (RegExp) + regexMsg (string) - formato especifico (ej: email)
const validateFields = (rules) => (req, res, next) => {
    // Compatibilidad: si llega un array de nombres, se convierte a reglas "required".
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
