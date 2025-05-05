import { AuthRepository } from "../repository/auth.repository"
import { ProductRepository } from "../repository/product.repository"
import { CategoryRepository } from "../repository/category.repository"
import { ProductInfo } from "../types/product.types"
import { CategoryInfo } from "../types/category.types"
import createHttpError from "../utils/httpError.utils"
import { ObjectId } from "mongoose"


export class ProductServices{
    private readonly productRepository: ProductRepository
    private readonly authRepository: AuthRepository
    private readonly categoryRepository: CategoryRepository

    constructor(){
        this.productRepository = new ProductRepository()
        this.authRepository = new AuthRepository()
        this.categoryRepository = new CategoryRepository()
    }

    getProductList = async () =>{
        const products = await this.productRepository.getProductList()
        if(products.length == 0){
            throw createHttpError.NotFound("Product List is Empty")
        }
        return products
    }
    
    getProductById = async(id: string): Promise<ProductInfo>=>{
        const product = await this.productRepository.getProductById(id)
        if(!product){
            throw createHttpError.NotFound("Product with Id not found")
        }
        return product as unknown as ProductInfo
    }
    
    createProduct = async(productInfo: ProductInfo, userId: string) =>{
        const user = await this.authRepository.getUserById(userId)
        if(!user){
            throw createHttpError.NotFound("User with Id not found.")
        }

        let category_list: CategoryInfo[] = []

        if(productInfo.category){
            const category = await this.categoryRepository.getCategory(productInfo.category as unknown as string)
            
            if(!category){
                const category = await this.categoryRepository.createCategory(productInfo.category as unknown as string)
                category_list.push(category as unknown as CategoryInfo)
            } else {
                category_list.push(category as unknown as CategoryInfo)
            }
        } else {
            category_list = []
        }
        const result = await this.productRepository.createProduct({
            name: productInfo.name,
            price: productInfo.price,
            description: productInfo.description,
            category: category_list as CategoryInfo[],
            inventory: productInfo.inventory,
            addedBy: {
                fullname: user?.fullname,
                email: user?.email
            }
        })
        return result
    }
    
    updateProduct = async(id: string, productInfo: ProductInfo) =>{
        const product = await this.productRepository.getProductById(id)
        if(!product){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        if(productInfo.category){
            const category = await this.categoryRepository.getCategory(productInfo.category as unknown as string) as unknown as CategoryInfo
            
            if(!category){
                const newCategory = await this.categoryRepository.createCategory(productInfo.category as unknown as string)
                
                const updateProductInfo = {
                    name : productInfo.name || product.name,
                    price : productInfo.price || product.price,
                    description : productInfo.description || product.description,
                    category: [...product.category, newCategory],
                    inventory: product.inventory + productInfo.inventory || product.inventory
                }
                
                const result = await this.productRepository.updateProduct(id, updateProductInfo as unknown as ProductInfo)
                return result
            }
            const updateProductInfo = {
                name : productInfo.name || product.name,
                price : productInfo.price || product.price,
                description : productInfo.description || product.description,
                category: [...product.category, category],
                inventory: product.inventory+ productInfo.inventory || product.inventory
            }
            const result = await this.productRepository.updateProduct(id, updateProductInfo as unknown as ProductInfo)
            return result
        }
        
        const result = await this.productRepository.updateProduct(id, productInfo)
        return result 
    }
    
    removeProduct = async(id: string) =>{
        const productExist = await this.productRepository.getProductById(id)
        if(!productExist){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        const product = await this.productRepository.removeProduct(id)
        return product
    }

    removateCategoryFromProduct = async(productId: string, category: string)=>{
        const productExist = await this.productRepository.getProductById(productId)
        const categoryExist = await this.categoryRepository.getCategory(category)
        
        if(!categoryExist){
            throw createHttpError.NotFound("Category with name not found.")
        }

        if(!productExist){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        const product = await this.productRepository.removeCategory(productId, categoryExist._id)
        return product
    }
}
