import Order from "../models/order.model";
import { IOrder } from "../types/order.type";

export class OrderRepository{
    async getOrderList(userId: string){
        return await Order.findOne({userId: userId}).populate('cart', 'items')
    }

    async createOrder(orderInfo: IOrder){
        const result = await Order.create(orderInfo)
    }
}