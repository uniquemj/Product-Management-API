import { Response } from "express"
import { IAuthRequest, IError } from "../types/auth.types"
import CartServices from "../services/cart.services"
import createHttpError from "../utils.js/httpError.utils"

const getCartList = async(req: IAuthRequest, res: Response) =>{
    try{
        const carts = await CartServices.getCartList(req.user!._id!)
        if(!carts){
            throw createHttpError.NotFound("Cart is Empty")
        }
        res.status(200).send({message: "Cart fetched Successfully.", response: carts})
    } catch(e:any){
        throw createHttpError.InternalServerError(e.message)
    }
}

const addToCart = async(req: IAuthRequest, res: Response) =>{
    try{

        if(!req.body){
            throw createHttpError.BadRequest("Product Id required.")
        }
        const {productId, quantity} = req.body
        
        const result = await CartServices.addToCart(productId, quantity, req.user!._id!)
        res.status(200).send({message: "Item Added to card.", response: result})
    } catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const removeItemFromCart = async(req: IAuthRequest, res: Response) =>{
    try{
        const {productId} = req.body
        if(!productId){
            throw createHttpError.BadRequest("Product Id is required")
        }
        const userId = req.user!._id!
        const result = await CartServices.removeItemFromCart(userId, productId)
        res.status(200).send({message: "Item Removed from Cart."})
    } catch (e:any){
        throw createHttpError.Custom(e.statuscode, e.message)
    }
}

const updateCartQuantity = async(req: IAuthRequest, res: Response)=>{
    try{
        const {productId, quantity} = req.body
        if(!productId){
            throw createHttpError.BadRequest("Product Id is required")
        }
        if(!quantity){
            throw createHttpError.BadRequest("Quantity is required")
        }
        const userId = req.user!._id!
        const result = await CartServices.updateCartQuantity(userId, productId, quantity)
        res.status(200).send({message: "Item quantity updated."})
    }catch(e:any){
        throw createHttpError.Custom(e.statuscode, e.message)
    }
}

const CartController = {
    addToCart, 
    getCartList,
    removeItemFromCart,
    updateCartQuantity
}

export default CartController