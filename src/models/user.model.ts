import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullname: {type: String, required: true, minlength: 8, maxlength: 200},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, enum: ['admin', 'user']}
}, {timestamps: true})

const User = mongoose.model('user', userSchema)

export default User