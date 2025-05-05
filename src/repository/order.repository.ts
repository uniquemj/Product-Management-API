import Order from "../models/order.model";
import { OrderInfo, StatusInfo } from "../types/order.type";

export class OrderRepository{
    async getOrderList(){
        return await Order.find().populate('cart', 'items')
    }

    async getUserOrder(userId:string){
        return await Order.findOne({userId: userId})
    }

    async getOrder(orderId: string){
        return await Order.findById(orderId)
    }

    async createOrder(orderInfo: OrderInfo){
        const result = await Order.create(orderInfo)
        return result
    }

    async updateStatus(orderId: string, statusInfo:StatusInfo){
        return await Order.findByIdAndUpdate(orderId, statusInfo, {new: true})
    }
}