import mongoose from 'mongoose'


const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    items: [{
        type: new mongoose.Schema({
            product: {
                type: new mongoose.Schema({
                    p_id: String,
                    name: String,
                    price: Number,
                    inventory: Number
                })
            },
            quantity: {type: Number, default: 1}
        }),
        required: true
    }]
})

const Cart = mongoose.model('cart', cartSchema)
export default Cart