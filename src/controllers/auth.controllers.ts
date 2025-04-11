import { Request, Response, Router } from "express"
import { COOKIE_NAMES } from "../constants/cookie.constants"
import {AuthServices} from "../services/auth.services"
import createHttpError from "../utils/httpError.utils"
import validate from "../middlewares/validate.middleware"
import {loginSchema, registerSchema} from '../validate/auth.validate'

export class AuthController{
    readonly router: Router;
    private static instance: AuthController;
    private readonly authServices: AuthServices;

    private constructor(){
        this.router = Router();
        this.authServices = new AuthServices()
    }

    static initController(){
        const instance = new AuthController()
        AuthController.instance = instance
        instance.router.post('/register-user', validate(registerSchema),instance.registerUser)
        instance.router.post('/register-admin', validate(registerSchema), instance.registerAdmin)
        instance.router.post('/login', validate(loginSchema), instance.login)
        instance.router.post('/logout', instance.logout)
        return instance
    }
    
    registerUser = async(req: Request, res: Response) =>{
        try{
            const userInfo = req.body
            const role = "user"
            const user = await this.authServices.registerUser(userInfo, role)
            res.status(200).send({message:"User registered successfully.", response:user})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    login = async(req: Request, res: Response) =>{
        try{
            const userCredentials = req.body
            
            const userInfo = await this.authServices.loginUser(userCredentials)
            
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
    
    logout = async(req: Request, res: Response) =>{
        try{
            res.clearCookie('USER_TOKEN')
            res.status(200).send({message: "User Logged out Successfully."})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    registerAdmin = async(req: Request, res: Response) =>{
        try{
            const adminInfo = req.body
            const role = "admin"
            const user = await this.authServices.registerUser(adminInfo, role)
            res.status(200).send({message: "Admin Registered Successfully", response: user})
        }catch(e: any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
}
