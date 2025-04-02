import { IAuthCredentials, IUserInfo } from "../types/auth.types"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/user.model"

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

const registerUser = async(userInfo:IUserInfo, role: string) =>{
    const {fullname, email, password} = userInfo
    const emailExist = await User.findOne({email: email})
    
    if(emailExist){
        return null
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        role: role
    })
    await newUser.save()
    return newUser
}

const loginUser = async(userCredentials: IAuthCredentials) =>{
    const {email, password} = userCredentials

    const userExist = await User.findOne({email: email})

    
    if(!userExist){
        return {message: "User with email doesn't exist."}
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password)
    if(!isPasswordMatch){
        return {message: "Password Incorrect"}
    }

    const token = jwt.sign({_id: userExist._id, email: userExist.email, role: userExist.role},JWT_SECRET_KEY,{expiresIn: "1d"} )
    return {token, user: userExist}
}

const UserServices = {
    registerUser,
    loginUser
}

export default UserServices