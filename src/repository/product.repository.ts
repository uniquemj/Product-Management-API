import Product from "../models/product.model";
import { IProduct } from "../types/product.types";

export class ProductRepository{
    async getProductList(){
        return await Product.find().populate('category','name -_id')
    }

    async getProductById(id: string){
        const product = await Product.findOne({_id: id}).populate('category','name -_id')
        return product
    }

    async createProduct(productInfo: IProduct){
        const result = await Product.create(productInfo)
        return result
    }

    async updateProduct(id: string, productInfo : IProduct){
        const result = await Product.findOneAndUpdate({_id: id}, productInfo, {new: true})
        return result
    }

    async removeProduct(id: string){
        const result = await Product.findOneAndDelete({_id: id})
        return result
    }

    async updateInventory(id: string, quantity: number){
        const result = await Product.findOneAndUpdate(
            {_id: id},
            {
                $inc: {
                    inventory: -quantity
                }
            }
        )
    }
}