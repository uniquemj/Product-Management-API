import { AuthRepository } from "../repository/auth.repository"
import { ProductRepository } from "../repository/product.repository"
import { CategoryRepository } from "../repository/category.repository"
import { ICategory, IProduct } from "../types/product.types"
import createHttpError from "../utils/httpError.utils"


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
    
    getProductById = async(id: string): Promise<IProduct>=>{
        const product = await this.productRepository.getProductById(id)
        if(!product){
            throw createHttpError.NotFound("Product with Id not found")
        }
        return product as unknown as IProduct
    }
    
    createProduct = async(productInfo: IProduct, userId: string) =>{
        const user = await this.authRepository.getUserById(userId)
        if(!user){
            throw createHttpError.NotFound("User with Id not found.")
        }
        let category_list = []
        const category = await this.categoryRepository.getCategory(productInfo.category as unknown as string)
        
        if(!category && productInfo.category){
            const category = await this.categoryRepository.createCategory(productInfo.category as unknown as string)

            category_list.push(category)
            const result = await this.productRepository.createProduct({
                name: productInfo.name,
                price: productInfo.price,
                description: productInfo.description,
                category: category_list as ICategory[],
                inventory: productInfo.inventory,
                addedBy: {
                    fullname: user?.fullname,
                    email: user?.email
                }
            })
            return result
        }
        category_list.push(category)
        
        const result = await this.productRepository.createProduct({
            name: productInfo.name,
            price: productInfo.price,
            description: productInfo.description,
            category: category_list as ICategory[],
            inventory: productInfo.inventory,
            addedBy: {
                fullname: user?.fullname,
                email: user?.email
            }
        })
        return result
    }
    
    updateProduct = async(id: string, productInfo: IProduct) =>{
        const product = await this.productRepository.getProductById(id)
        if(!product){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        
        if(productInfo.category){
            const category = await this.categoryRepository.getCategory(productInfo.category as unknown as string)
            if(!category){
                const newCategory = await this.categoryRepository.createCategory(productInfo.category as unknown as string)
                
                const updateProductInfo = {
                    name : productInfo.name || product.name,
                    price : productInfo.price || product.price,
                    description : productInfo.description || product.description,
                    category: [...product.category, newCategory],
                    inventory: product.inventory + productInfo.inventory || product.inventory
                }
                
                const result = await this.productRepository.updateProduct(id, updateProductInfo as unknown as IProduct)
                return result
            }
            const updateProductInfo = {
                name : productInfo.name || product.name,
                price : productInfo.price || product.price,
                description : productInfo.description || product.description,
                category: [...product.category, category],
                inventory: product.inventory+ productInfo.inventory || product.inventory
            }
            const result = await this.productRepository.updateProduct(id, updateProductInfo as unknown as IProduct)
            return result
        }
        
        const result = await this.productRepository.updateProduct(id, productInfo)
        return result 
    }
    
    removeProduct = async(id: string) =>{
        const task = await this.productRepository.getProductById(id)
        if(!task){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        const product = await this.productRepository.removeProduct(id)
        return product
    }
}
