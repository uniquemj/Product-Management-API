import {Types} from 'mongoose'

export interface ICartPorductDetail{
    p_id: Types.ObjectId,
    name: string,
    price: number,
    inventory: number
}
export interface ICartItem{
    product: ICartPorductDetail,
    quantity: number
}


export interface ICart{
    userId?: Types.ObjectId,
    items: Array<ICartItem>
}