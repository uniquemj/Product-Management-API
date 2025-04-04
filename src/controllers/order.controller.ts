import {Response} from 'express'
import { IAuthRequest } from '../types/auth.types'
import createHttpError from '../utils.js/httpError.utils'
import OrderServices from '../services/order.services'

const getOrderList = async(req: IAuthRequest, res: Response) =>{
    const userId = req.user!._id!

    const orders = await OrderServices.getOrderList(userId)
    if(!orders){
        throw createHttpError.NotFound("Order List is Empty")
    }
    res.status(200).send({message: "Order Fetched.", response: orders})
}

const createOrder = async(req: IAuthRequest, res: Response) =>{
    const userId = req.user!._id!
    const result = await OrderServices.createOrder(userId)
    res.status(200).send({message: "Order Created.", response: result})
}

const OrderControllers = {
    getOrderList,
    createOrder
}

export default OrderControllers