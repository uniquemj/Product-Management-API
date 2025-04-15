import Cart from "../models/cart.model";
import { ICart, ICartItem } from "../types/cart.types";

export class CartRepository{

    async getCart(userId: string){
        return await Cart.findOne({userId: userId})
    }

    async createCart(cartInfo: ICart){
        const result = await Cart.create(cartInfo)
        return result
    }   

    async pushToCart(user_Id: string, cartItem: ICartItem){
        const result = await Cart.findOneAndUpdate(
            { userId: user_Id },
            { $push: { items: cartItem } },
            { new: true }
        )
        return result
    }

    async updateQuantity(user_Id: string, productId: string){
        const result = await Cart.findOneAndUpdate(
            { userId: user_Id, 'items.product.p_id': productId },
            { $inc: { 'items.$.quantity': 1 } },
            { new: true }
        )
        return result
    }

    async resetCart(userId: string){
        await Cart.findOneAndUpdate(
            {userId: userId},
            {
                $set: {
                    items: []
                }
            }
        )
    }

    async removeCartItem(userId: string, productId: string){
        return await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { items: { 'product.p_id': productId } } },
            { new: true }
        )
    }
}