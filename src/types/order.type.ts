
import { CartItemSchema } from "../models/cart.model";

export interface OrderInfo{
    userid?:string,
    total: number,
    cart?: CartItemSchema[]
}

export interface StatusInfo{
    status: string
}