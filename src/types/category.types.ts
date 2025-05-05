import { Schema } from "mongoose"

export interface CategoryInfo{
    _id?: Schema.Types.ObjectId,
    name: string
}