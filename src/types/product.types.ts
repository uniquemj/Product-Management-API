import { Types } from "mongoose"

export interface IOwner{
    _id: string,
    fullname: string,
    email: string
}
export interface ICategory{
    _id?:string,
    name?:string
}

export interface IProduct{
    _id?: Types.ObjectId,
    name: string,
    price: number,
    description ?: string,
    category ?: Array<ICategory>,
    inventory: number,
    addedBy?: IOwner
}