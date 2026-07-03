const errorMiddleware = (error, req, res, next) => {
    const status = error.statusCode || 500
    console.error(error)
    return res.status(status).json({
        message: error.message || 'Error interno del servidor',
        ok: false,
        status
    })
}

export default errorMiddleware
