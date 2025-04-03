import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {type: String, require: true},
    price: {type: Number, require: true},
    description: String,
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}],
    inventory: {type: Number, default: 0},
    addedBy: {
        type: new mongoose.Schema({
            fullname: String,
            email: String
        }),
        required: true
    },
})

const Product = mongoose.model('product', productSchema)

export default Product