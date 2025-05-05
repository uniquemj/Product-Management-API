import { Schema, Types } from "mongoose"
import { CategoryInfo } from "./category.types"

export interface Owner{
    _id?: string,
    fullname: string,
    email: string
}


export interface ProductInfo{
    _id?: Types.ObjectId,
    name: string,
    price: number,
    description ?: string,
    category ?: Array<CategoryInfo>,
    inventory: number,
    addedBy?: Owner
}