import Product from "../models/product.model"
import { IProduct } from "../types/product.types"

const getProductList = async () =>{
    const products = await Product.find()
    return products
}

const getProductById = async(id: string): Promise<IProduct|null>=>{
    try{
        return await Product.findById(id)
    } catch(e){
        return null
    }
}

const createProduct = async(productInfo: IProduct) =>{
    const product = await Product.create(productInfo)
    return product 
}

const updateProduct = async(id: string, productInfo: IProduct) =>{
    const product = await Product.findOneAndUpdate({_id: id}, productInfo, {new: true})
    return product
}

const removeProduct = async(id: string) =>{
    const product = await Product.findOneAndDelete({_id: id})
    return product
}

const ProductServices = {
    getProductList,
    createProduct,
    getProductById,
    updateProduct,
    removeProduct
}

export default ProductServices