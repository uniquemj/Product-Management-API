import Category from "../models/category.model"
import Product from "../models/product.model"
import User from "../models/user.model"
import { IProduct } from "../types/product.types"

const getProductList = async () =>{
    const products = await Product.find().populate('category','name -_id')
    return products
}

const getProductById = async(id: string): Promise<IProduct|null>=>{
    try{
        const product = await Product.findOne({_id: id}).populate('category','name -_id').lean()
        return product as unknown as IProduct
    } catch(e){
        return null
    }
}

const createProduct = async(productInfo: IProduct, userId: string) =>{
    const user = await User.findById({_id: userId})
    console.log(user)
    const category = await Category.findOne({name: productInfo.category})
    console.log(category)

    if(!category){
        const category = await Category.create({name: productInfo.category})
        const result = await Product.create({
            name: productInfo.name,
            price: productInfo.price,
            description: productInfo.description,
            category: [category],
            inventory: productInfo.inventory,
            addedBy: {
                fullname: user?.fullname,
                email: user?.email
            }
        })
        return result
    }

    const result = await Product.create({
        name: productInfo.name,
        price: productInfo.price,
        description: productInfo.description,
        category: [category],
        inventory: productInfo.inventory,
        addedBy: {
            fullname: user?.fullname,
            email: user?.email
        }
    })
    return result
}

const updateProduct = async(id: string, productInfo: IProduct) =>{
    const product = await Product.findById(id)
    if(!product){
        return null
    }


    const category = await Category.findOne({name: productInfo.category})

    
    if(productInfo.category){
        if(!category){
            const newCategory = await Category.create({name: productInfo.category})

            const updateProductInfo = {
                name : productInfo.name || product.name,
                price : productInfo.price || product.price,
                description : productInfo.description || product.description,
                category: [...product.category, newCategory],
                inventory: product.inventory + productInfo.inventory || product.inventory
            }
            
            const result = await Product.findByIdAndUpdate({_id: id}, updateProductInfo, {new: true})
            return result
        }
        const updateProductInfo = {
            name : productInfo.name || product.name,
            price : productInfo.price || product.price,
            description : productInfo.description || product.description,
            category: [...product.category, category],
            inventory: product.inventory+ productInfo.inventory || product.inventory
        }
        const result = await Product.findByIdAndUpdate({_id: id}, updateProductInfo, {new: true})
        return result
    }

    const result = await Product.findOneAndUpdate({_id: id}, productInfo, {new: true})
    return result 
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