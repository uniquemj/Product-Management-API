import { AuthCredentials, UserInfo } from "../types/auth.types"
import bcrypt from 'bcryptjs'
import User from "../models/user.model"
import createHttpError from "../utils/httpError.utils"
import { AuthRepository } from "../repository/auth.repository"



export class AuthServices{
    private readonly authRepository: AuthRepository
    constructor(){
        this.authRepository = new AuthRepository()
    }
    
    registerUser = async(userInfo:UserInfo, role: string) =>{
        const {fullname, email, password} = userInfo
        const emailExist = await this.authRepository.getUser(email)
        
        if(emailExist){
            throw createHttpError.BadRequest("User with Email already exist.")
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
    
    loginUser = async(userCredentials: AuthCredentials) =>{
        const {email, password} = userCredentials
        
        const userExist = await this.authRepository.getUser(email)
        
        if(!userExist){
            throw createHttpError.NotFound("User with email doesn't exist.")
        }
        
        const isPasswordMatch = await bcrypt.compare(password, userExist.password)

        if(!isPasswordMatch){
            throw createHttpError.BadRequest("Invalid")
        }
        
        const result = await this.authRepository.loginUser(userCredentials)
        return result
    }
}
