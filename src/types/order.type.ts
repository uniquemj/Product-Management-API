
import { CartItemSchema } from "../models/cart.model";

export interface IOrder{
    userid?:string,
    total: number,
    cart?: CartItemSchema[]
}