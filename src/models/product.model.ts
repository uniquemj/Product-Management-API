import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {type: String, require: true},
    price: {type: Number, require: true},
    description: String,
    category: [String],
    addedby: {type: mongoose.Types.ObjectId, ref: 'user'},
    inventory: {type: Number, default: 0}
})

const Product = mongoose.model('product', productSchema)

export default Product