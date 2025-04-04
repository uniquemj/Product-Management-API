import Order from "../models/order.model"
import Cart from "../models/cart.model"
import Product from "../models/product.model"
import createHttpError from "../utils.js/httpError.utils"

const getOrderList = async(userId: string) =>{
    const order = await Order.findOne({userId: userId}).populate('cart', 'items')
    if(!order){
        return null
    }
    return order
}

const createOrder = async(userId: string) =>{
    const cart = await Cart.findOne({userId: userId}).populate('items','-_id')

    if(cart?.items.length == 0){
        throw createHttpError.BadRequest("Cart is Empty. Can't create Order.")
    }
    const cartTotal = cart?.items.reduce((total, item):number=>{
        total += (item.product.price * item.quantity)
        return total
    }, 0)

    const orderItem = {
        userId: userId,
        total: cartTotal,
        cart: cart?.items
    }

    const order = await Order.create(orderItem)

    // for updating product inventory
    cart?.items.forEach(async(item)=>{
        await Product.findOneAndUpdate(
            {_id: item.product.p_id},
            {
                $inc: {
                    inventory: -item.quantity
                }
            }
        )
    })

    await Cart.findOneAndUpdate(
        {userId: userId},
        {
            $set: {
                items: []
            }
        }
    )
    return order
}

const OrderServices = {
    getOrderList,
    createOrder
}

export default OrderServices