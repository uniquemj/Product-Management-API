import {Document, Schema, Model, model} from 'mongoose'

interface ProductDocument extends Document{
    name: string,
    price: number,
    description: string,
    category: Schema.Types.ObjectId[],
    inventory: number,
    addedBy: {
        fullname: string,
        email: string
    }
}

const productSchema: Schema<ProductDocument> = new Schema({
    name: {type: String,},
    price: {type: Number},
    description: {type: String},
    category: [{type: Schema.Types.ObjectId, ref: 'category'}],
    inventory: {type: Number},
    addedBy: {
        fullname: {type: String},
        email: {type: String,}
    }
})

const Product: Model<ProductDocument> = model('product', productSchema)

export default Product
