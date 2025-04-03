import Cart from "../models/cart.model"
import User from "../models/user.model"
import { ICart, ICartItem } from "../types/cart.types"
import ProductServices from "./product.services"
import createHttpError from "../utils.js/httpError.utils"

const getCartList = async(userId:string) =>{
    const user = await User.findById(userId)
    if(!user){
        throw createHttpError.NotFound("User not found.")
    }
    const cart = await Cart.findOne({userId:userId})
    if(!cart){
        throw createHttpError.BadRequest("Cart is Empty!")
    }
    return cart
}

const addToCart = async(productId:string, quantity:number = 1, user_Id:string): Promise<ICart> =>{
    const productExist = await ProductServices.getProductById(productId)

    if(!productExist){
        throw createHttpError.NotFound("Product Not found")
    }
    const user = await User.findOne({_id: user_Id}).lean()

    if(!user){
        throw createHttpError.NotFound("User Not Found.")
    }

    const cart = await Cart.findOne({userId: user!._id}).lean()
    if(!cart){
        const result = await Cart.create({
            userId: user._id,
            items: [
                {
                    product: {
                        p_id: productExist?._id,
                        name: productExist?.name,
                        price: productExist?.price,
                        inventory: productExist?.inventory
                    },
                    quantity: quantity
                }
            ]
        })
        return result as unknown as ICart
    }


    const cartItem = {
        product: {
            p_id: productExist?._id,
            name: productExist?.name,
            price: productExist?.price,
            inventory: productExist?.inventory
        },
        quantity: quantity
    }
    const cartItems = cart.items as unknown as Array<ICartItem>

    // const productExistInCart = cartItems.find((item)=>item.product.p_id == productExist._id)
    // const productNotExist = cartItems.filter((item)=> item.product.p_id != productExist._id)

    // if(productExistInCart){
    //     const productIndex = cartItems.findIndex((item)=>item.product.p_id == productExist._id)
    //     cartItems[productIndex].quantity += 1
    //     const result = await Cart.findOneAndUpdate(cart._id, {...cart, items: [...productNotExist, ...cartItems]}, {upsert:true, new:true})
    //     console.log("Result: ", result)
    //     return result as unknown as ICart
    // }

    const result = await Cart.findByIdAndUpdate(cart._id,{$push: {items: cartItem}}, {upsert: true, new: true})
    return result as unknown as ICart
}

const CartServices = {
    addToCart,
    getCartList
}

export default CartServices