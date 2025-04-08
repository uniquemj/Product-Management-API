import { Request, Response } from "express"
import ProductServices from "../services/product.services"
import { IAuthRequest,  } from "../types/auth.types"
import createHttpError from "../utils.js/httpError.utils"

const getProductList = async(req: IAuthRequest, res: Response) =>{
    try{
        const products = await ProductServices.getProductList()
        if(products.length == 0){
            throw createHttpError.NotFound("Product List is Empty")
        }
        res.status(200).send(products)
    }catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const getProductById = async(req: IAuthRequest, res: Response) =>{
    try{
        const {id} = req.params
        const product = await ProductServices.getProductById(id as string)

        if(!product){
            throw createHttpError.NotFound("Product with Id not found.")
        }

        res.status(200).send({message: "Product Fetched Successfully.", product: product})
    } catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const createProduct = async(req: IAuthRequest, res: Response) =>{
    try{
        const {name, price, description, category, inventory} = req.body

        const productInfo = {
            name,
            price,
            description: description ?? "",
            category: category.toLowerCase(), 
            inventory: inventory ?? 0,
        }
        const product = await ProductServices.createProduct(productInfo, req.user!._id!)

        res.status(201).send({message: "Product Created Succesfully", product})
    } catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const updateProduct = async(req: IAuthRequest, res: Response) =>{
    try{
        const productInfo = req.body
        const {id} = req.params
        
        const product = await ProductServices.updateProduct(id, productInfo)
        if(!product){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        res.status(200).send({message: "Product Updated.", product: product})
    } catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const removeProduct = async(req: IAuthRequest, res: Response) =>{
    try{

        const {id} = req.params
        
        const task = await ProductServices.getProductById(id)
        if(!task){
            throw createHttpError.NotFound("Product with Id not found.")
        }
        
        const product = await ProductServices.removeProduct(id)
        res.status(200).send({message: "Product removed.", product: product})
    }catch(e:any){
        throw createHttpError.Custom(e.statusCode, e.message)
    }
}

const ProductController = {
    getProductList, 
    createProduct,
    getProductById,
    updateProduct,
    removeProduct
}

export default ProductController