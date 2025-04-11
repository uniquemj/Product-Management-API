import { Response, Router } from "express"
import { IAuthRequest, IError } from "../types/auth.types"
import {CartServices} from "../services/cart.services"
import createHttpError from "../utils/httpError.utils"
import allowedRole from "../middlewares/role.middleware"
import validate from "../middlewares/validate.middleware"
import { alterCartSchema } from "../validate/cart.validate"

export class CartController{
    readonly router: Router
    private static instance: CartController
    private readonly cartServices: CartServices

    private constructor(){
        this.router = Router()
        this.cartServices = new CartServices()
    }

    static initController(){
        const instance = new CartController()
        CartController.instance = instance

        instance.router.get('/',allowedRole('user'), instance.getCartList)
        instance.router.post('/',validate(alterCartSchema), allowedRole('user'), instance.addToCart)
        instance.router.post('/remove', validate(alterCartSchema), allowedRole('user'), instance.removeItemFromCart)
        instance.router.post('/quantity', validate(alterCartSchema), allowedRole('user'), instance.updateCartQuantity)
        return instance
    }
    getCartList = async(req: IAuthRequest, res: Response) =>{
        try{
            const cart = await this.cartServices.getCartList(req.user!._id!)
            res.status(200).send({message: "Cart fetched Successfully.", response: cart})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    addToCart = async(req: IAuthRequest, res: Response) =>{
        try{
            const {productId, quantity} = req.body
            
            const result = await this.cartServices.addToCart(productId, quantity, req.user!._id!)
            res.status(200).send({message: "Item Added to card.", response: result})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    removeItemFromCart = async(req: IAuthRequest, res: Response) =>{
        try{
            const {productId} = req.body
            const userId = req.user!._id!
            const result = await this.cartServices.removeItemFromCart(userId, productId)
            res.status(200).send({message: "Item Removed from Cart."})
        } catch (e:any){
            throw createHttpError.Custom(e.statuscode, e.message)
        }
    }
    
    updateCartQuantity = async(req: IAuthRequest, res: Response)=>{
        try{
            const {productId, quantity} = req.body
            const userId = req.user!._id!
            const result = await this.cartServices.updateCartQuantity(userId, productId, quantity)
            res.status(200).send({message: "Item quantity updated."})
        }catch(e:any){
            throw createHttpError.Custom(e.statuscode, e.message)
        }
    }
    
}


