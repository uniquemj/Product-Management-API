import { Request, Response } from "express"
import { COOKIE_NAMES } from "../constants/cookie.constants"
import UserServices from "../services/auth.services"

const registerUser = async(req: Request, res: Response) =>{
    try{
        const userInfo = req.body
        if(!userInfo.fullname){
            res.status(400).send({message: "fullname is required"})
            return
        }
        if(!userInfo.email){
            res.status(400).send({message: "email is required"})
            return
        }
        if(!userInfo.password){
            res.status(400).send({message: "password is required"})
            return
        }
        const role = "user"
        const user = await UserServices.registerUser(userInfo, role)
        if(!user){
            res.status(400).send({message: "User with email exist."})
            return
        }
        res.status(200).send({message:"User registered successfully.", response:user})
    } catch(e:any){
        res.status(500).send({message: e.message})
    }
}

const login = async(req: Request, res: Response) =>{
    try{
        const userCredentials = req.body

        const userInfo = await UserServices.loginUser(userCredentials)

        if(userInfo.message){
            res.status(400).send({message: userInfo.message})
            return
        }

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
        res.status(500).send({message:e.message})
    }
}

const logout = async(req: Request, res: Response) =>{
    try{
        res.clearCookie('USER_TOKEN')
        res.status(200).send({message: "User Logged out Successfully."})
    } catch(e:any){
        res.status(500).send({message: e.message})
    }
}
const registerAdmin = async(req: Request, res: Response) =>{
    try{
        const adminInfo = req.body
        if(!adminInfo.fullname){
            res.status(400).send({message: "fullname is required"})
            return
        }
        if(!adminInfo.email){
            res.status(400).send({message: "email is required"})
            return
        }
        if(!adminInfo.password){
            res.status(400).send({message: "password is required"})
            return
        }
        const role = "admin"
        const user = await UserServices.registerUser(adminInfo, role)
        if(!user){
            res.status(400).send({message: "User with email exist."})
            return
        }
        res.status(200).send({message: "Admin Registered Successfully", response: user})
    }catch(e: any){
        res.status(500).send({message: e.message})
    }
}


const UserController = {
    registerUser,
    login,
    registerAdmin,
    logout
}

export default UserController