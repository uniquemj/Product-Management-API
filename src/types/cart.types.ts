import {Types} from 'mongoose'

export interface CartPorductDetail{
    p_id: Types.ObjectId,
    name: string,
    price: number,
    inventory?: number
}
export interface CartItem{
    product: CartPorductDetail,
    quantity: number
}


export interface CartInfo{
    userId?: Types.ObjectId,
    items: Array<CartItem>
}