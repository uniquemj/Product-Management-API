import { Request, Response } from "express"
import { COOKIE_NAMES } from "../constants/cookie.constants"
import UserServices from "../services/auth.services"
import createHttpError from "../utils.js/httpError.utils"

const registerUser = async(req: Request, res: Response) =>{
    try{
        const userInfo = req.body
        if(!userInfo.fullname){
            throw createHttpError.BadRequest("fullname is required")
        }
        if(!userInfo.email){
            throw createHttpError.BadRequest("email is required")
        }
        if(!userInfo.password){
            throw createHttpError.BadRequest('password is required')
        }
        const role = "user"
        const user = await UserServices.registerUser(userInfo, role)
        if(!user){
            throw createHttpError.BadRequest('User with email exist.')
        }
        res.status(200).send({message:"User registered successfully.", response:user})
    } catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const login = async(req: Request, res: Response) =>{
    try{
        const userCredentials = req.body

        const userInfo = await UserServices.loginUser(userCredentials)

        res.cookie(
            COOKIE_NAMES.USER_TOKEN, userInfo.token,
            {
                httpOnly:true,
                secure: true,
                sameSite: "strict",
                maxAge: 24*60*60*1000,
            }
        )
       
        res.status(200).send({message: "User Login Successfully", token: userInfo.token, user: userInfo.user})

    }catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const logout = async(req: Request, res: Response) =>{
    try{
        res.clearCookie('USER_TOKEN')
        res.status(200).send({message: "User Logged out Successfully."})
    } catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const registerAdmin = async(req: Request, res: Response) =>{
    try{
        const adminInfo = req.body
        if(!adminInfo.fullname){
            throw createHttpError.BadRequest("fullname is required")
        }
        if(!adminInfo.email){
            throw createHttpError.BadRequest("email is required")
        }
        if(!adminInfo.password){
            throw createHttpError.BadRequest("password is requried")
        }
        const role = "admin"
        const user = await UserServices.registerUser(adminInfo, role)
        if(!user){
            throw createHttpError.BadRequest("User with email exist.")
        }
        res.status(200).send({message: "Admin Registered Successfully", response: user})
    }catch(e: any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}


const UserController = {
    registerUser,
    login,
    registerAdmin,
    logout
}

export default UserController