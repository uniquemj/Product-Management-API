import {Schema, Document, Model, model} from 'mongoose'

enum UserRole{
    Admin='admin',
    USER='user'
}

interface UserDocument extends Document{
    fullname: string,
    email : string,
    password: string,
    role: UserRole,
}

const userSchema: Schema<UserDocument> = new Schema({
    fullname: {type: String, required: true, minlength: 8, maxlength: 200},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, enum: Object.values(UserRole)}
}, {timestamps: true})

const User: Model<UserDocument> = model('user', userSchema)

export default User