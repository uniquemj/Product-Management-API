import { Response, Router } from "express"
import {ProductServices} from "../services/product.services"
import { AuthRequest,  } from "../types/auth.types"
import createHttpError from "../utils/httpError.utils"
import authorizedRole from "../middlewares/role.middleware"
import productSchema, { updateCategorySchema } from "../validate/product.validate"
import validate from "../middlewares/validate.middleware"

export class ProductController{
    readonly router: Router
    private static instance: ProductController
    private readonly productServices: ProductServices

    private constructor(){
        this.router = Router()
        this.productServices = new ProductServices()
    }

    static initController(){
        const instance = new ProductController()
        ProductController.instance = instance

        instance.router.get('/', authorizedRole('user','admin'), instance.getProductList)
        instance.router.get('/:id', authorizedRole('user','admin'), instance.getProductById)
        instance.router.post('/', authorizedRole('admin'), validate(productSchema), instance.createProduct)
        instance.router.put('/:id', authorizedRole('admin'), instance.updateProduct)
        instance.router.delete('/:id', authorizedRole('admin'), instance.removeProduct)
        instance.router.post('/:id/category', authorizedRole('admin'), validate(updateCategorySchema), instance.removeCategoryFromProduct)

        return instance
    }

    getProductList = async(req: AuthRequest, res: Response) =>{
        try{
            const products = await this.productServices.getProductList()
            res.status(200).send(products)
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    getProductById = async(req: AuthRequest, res: Response) =>{
        try{
            const {id} = req.params
            const product = await this.productServices.getProductById(id as string)
            res.status(200).send({message: "Product Fetched Successfully.", product: product})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    createProduct = async(req: AuthRequest, res: Response) =>{
        try{
            const {name, price, description, category, inventory} = req.body
            
            const productInfo = {
                name,
                price,
                description: description ?? "",
                category: category, 
                inventory: inventory ?? 0,
            }
            const product = await this.productServices.createProduct(productInfo, req.user!._id!)
            
            res.status(201).send({message: "Product Created Succesfully", product})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    updateProduct = async(req: AuthRequest, res: Response) =>{
        try{
            const productInfo = req.body
            const {id} = req.params
            
            const product = await this.productServices.updateProduct(id, productInfo)
            
            res.status(200).send({message: "Product Updated.", product: product})
        } catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    removeProduct = async(req: AuthRequest, res: Response) =>{
        try{
            const {id} = req.params
            const product = await this.productServices.removeProduct(id)
            res.status(200).send({message: "Product removed.", product: product})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }

    removeCategoryFromProduct = async(req: AuthRequest, res: Response) =>{
        try{
            const {id} = req.params
            const {category} = req.body

            const product = await this.productServices.removateCategoryFromProduct(id, category)
            res.status(200).send({message: "Category removed from Product", product: product})
        }catch(e: any){
            throw createHttpError.Custom(e.statusCode, e.message, e.errors)
        }
    }
}
