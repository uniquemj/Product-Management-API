import { Response } from "express"
import { IAuthRequest, IError } from "../types/auth.types"
import CartServices from "../services/cart.services"
import createHttpError from "../utils.js/httpError.utils"

const addToCart = async(req: IAuthRequest, res: Response) =>{
    try{
        if(!req.body){
            throw createHttpError.BadRequest("Product Id required.")
        }
        const {productId, quantity} = req.body

        const result = await CartServices.addToCart(productId, quantity, req.user!._id!)
        res.status(200).send({message: "Item Added to card.", response: result})
    } catch(e: any){
        throw createHttpError.Custom(e.status, e.message, e.errors)
    }
}

const getCartList = async(req: IAuthRequest, res: Response) =>{
    try{
        const carts = await CartServices.getCartList(req.user!._id!)
        res.status(200).send({message: "Cart fetched Successfully.", response: carts})
    } catch(e:any){
        throw createHttpError.Custom(e.status, e.message, e.errors)
    }
}
const CartController = {
    addToCart, 
    getCartList
}

export default CartController