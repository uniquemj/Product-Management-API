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

    if(productExist.inventory < 1){
        throw createHttpError.BadRequest("Product out of stock")
    }

    const cart = await Cart.findOne({userId: user!._id})

    if(!cart){
        const result = await Cart.create({
            userId: user._id,
            items: [
                {
                    product: {
                        p_id: productExist?._id,
                        name: productExist?.name,
                        price: productExist?.price,
                    },
                    quantity: quantity
                }
            ]
        })
        return result as unknown as ICart
    }

    const result = await Cart.findOneAndUpdate(
        {userId: user_Id, 'items.product.p_id': productExist._id},
        {$inc: {'items.$.quantity': 1}},
        {new: true}
    )
    
    if(!result){
        const cartItem = {
            product: {
                p_id: productExist?._id,
                name: productExist?.name,
                price: productExist?.price,
            },
            quantity: quantity
        }
        const addItem = await Cart.findOneAndUpdate(
            {userId: user_Id},
            {$push: {items: cartItem}},
            {new: true}
        )
        return addItem as unknown as ICart
    }

    return result as unknown as ICart
    
}

const removeItemFromCart = async(userId: string, productId: string) =>{

    const cart = await Cart.findOne({userId: userId})
    if(!cart) throw createHttpError.BadRequest("Cart not found")

    const productExistInCart = await Cart.findOne({userId: userId, 'items.product.p_id': productId})

    if(!productExistInCart) throw createHttpError.NotFound("Product not found in cart.")
    
        const result = await Cart.findOneAndUpdate(
        {userId: userId},
        {$pull: {items: {'product.p_id': productId}}},
        {new: true}
    )

    return result
}

const updateCartQuantity = async(userId: string, productId: string, quantity: number) =>{
    const productExist = await Cart.findOne({userId: userId, 'items.product.p_id': productId})

    if(!productExist){
        throw createHttpError.BadRequest("Product not found.")
    }

    
    const result = await Cart.findOneAndUpdate(
        {userId:userId, 'items.product.p_id': productId},
        {
            $inc: {'items.$.quantity': quantity},
        },
        {new: true}
    )
    
    result?.items.forEach(async (item)=>{
        if(item.quantity < 1){
            await Cart.findOneAndUpdate(
                {userId: userId, 'items.product.p_id':productId},
                {$pull: {items: {'product.p_id': productId}}}
            )
            return item
        }
    })
}
const CartServices = {
    addToCart,
    getCartList,
    removeItemFromCart,
    updateCartQuantity
}

export default CartServices