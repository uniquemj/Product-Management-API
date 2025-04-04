import {Schema, Document, Model, model} from 'mongoose'
import { CartItemSchema } from './cart.model'

enum OrderStatus{
    PENDING="Pending",
    PROCESSING="Processing",
    DELIVERED="DELIVERED"
}

interface OrderDocument extends Document{
    userId: Schema.Types.ObjectId,
    total: number,
    timestamp: Date,
    cart:CartItemSchema[],
    status: OrderStatus
}


const orderSchema: Schema<OrderDocument> = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "user"},
    total: {type: Number},
    timestamp: {type: Date, default: Date.now},
    status:{type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING},
    cart:[{
        product:{
            name: {type: String},
            price: {type: Number}
        },
        quantity: {type: Number}
    }],
})

const Order: Model<OrderDocument> = model('order', orderSchema)

export default Order