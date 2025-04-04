import {Document, Schema, Model, model} from 'mongoose'

interface ProdcutSchema{
    p_id: Schema.Types.ObjectId,
    name: string,
    price: number
}

export interface CartItemSchema{
    product: ProdcutSchema,
    quantity: number
}

interface CartDocument extends Document{
    userId: Schema.Types.ObjectId,
    items: CartItemSchema[]
}

const cartSchema: Schema <CartDocument> = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    items: [{
            product: {
                    p_id: String,
                    name: String,
                    price: Number,
            },
            quantity: {type: Number, default: 1}
    }]
})

const Cart: Model<CartDocument> = model('cart', cartSchema)
export default Cart