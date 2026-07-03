import ServerError from '../utils/ServerError.js'

// Middleware factory: valida que los campos indicados vengan presentes (y no vacios) en req.body
const validateFields = (requiredFields) => (req, res, next) => {
    for (const field of requiredFields) {
        const value = req.body[field]
        if (value === undefined || value === null || value === '')
            return next(new ServerError(`El campo "${field}" es requerido`, 400))
    }
    next()
}

export default validateFields
