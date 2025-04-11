
import { ProductRepository } from "../repository/product.repository"
import { CartRepository } from "../repository/cart.repository"
import { OrderRepository } from "../repository/order.repository"

import createHttpError from "../utils/httpError.utils"

export class OrderServices{
    private readonly orderRepository: OrderRepository
    private readonly cartRepository: CartRepository
    private readonly productRepository: ProductRepository

    constructor(){
        this.productRepository = new ProductRepository()
        this.cartRepository = new CartRepository()
        this.orderRepository = new OrderRepository()
    }

    getOrderList = async(userId: string) =>{
        const orders = await this.orderRepository.getOrderList(userId)
        if(!orders){
            throw createHttpError.NotFound("Order List is Empty")
        }
        return orders
    }
    
    createOrder = async(userId: string) =>{
        const cart = await this.cartRepository.getCart(userId)
        
        if(cart?.items.length == 0){
            throw createHttpError.BadRequest("Cart is Empty. Can't create Order.")
        }

        const cartTotal = cart?.items.reduce((total, item):number=>{
            total += (item.product.price * item.quantity)
            return total
        }, 0)
        
        const orderItem = {
            userId: userId,
            total: cartTotal as number,
            cart: cart?.items
        }
        
        const order = await this.orderRepository.createOrder(orderItem)
        
        // for updating product inventory
        cart?.items.forEach(async(item)=>{
            await this.productRepository.updateInventory(item.product.p_id as unknown as string, item.quantity)
        })
        
        await this.cartRepository.resetCart(userId)
        return order
    }   
}
