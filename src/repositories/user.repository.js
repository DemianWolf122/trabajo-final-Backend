import User from '../models/user.model.js'

class UserRepository {
    async getById(id) {
        return await User.findById(id)
    }

    async getByEmail(email) {
        return await User.findOne({ email })
    }

    async create(nombre, email, password) {
        return await User.create({ nombre, email, password })
    }

    async updateById(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true })
    }
}

const userRepository = new UserRepository()
export default userRepository
