import { Request, Response } from "express"
import ProductServices from "../services/product.services"
import { IAuthRequest,  } from "../types/auth.types"
import createHttpError from "../utils.js/httpError.utils"

const getProductList = async(req: IAuthRequest, res: Response) =>{
    const products = await ProductServices.getProductList()
    if(products.length == 0){
        throw createHttpError.NotFound("Product List is Empty")
    }
    res.status(200).send(products)
}

const getProductById = async(req: IAuthRequest, res: Response) =>{
    try{
        const {id} = req.params
        const product = await ProductServices.getProductById(id as string)

        if(!product){
            res.status(404).send({message: "Product with Id not found."})
            return
        }

        res.status(200).send({message: "Product Fetched Successfully.", product: product})
    } catch(e:any){
        res.status(500).send({message: e.message})
    }
}

const createProduct = async(req: IAuthRequest, res: Response) =>{
    try{
        if(req.user!.role === "user"){
            res.status(403).send({message: "Unauthorized, Permission denied."})
            return
        }

        const {name, price, description, category, inventory} = req.body
        
        if(!name || !price){
            res.status(400).send({message: "Name and price field is required"})
            return
        }

        if(!category){
            res.status(400).send({message: "category is required."})
            return
        }

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
        res.status(500).send({message: e.message})
    }
}

const updateProduct = async(req: IAuthRequest, res: Response) =>{
    try{

        if(req.user!.role === "user"){
            res.status(403).send({message: "Unauthorized, Permission denied."})
            return
        }
        const productInfo = req.body
        const {id} = req.params
        
        const product = await ProductServices.updateProduct(id, productInfo)
        res.status(200).send({message: "Product Updated.", product: product})
    } catch(e:any){
        res.status(500).send({message: e.message})
    }
}

const removeProduct = async(req: IAuthRequest, res: Response) =>{
    if(req.user!.role === "user"){
        res.status(403).send({message: "Unauthorized, Permission denied."})
        return
    }
    const {id} = req.params

    const task = await ProductServices.getProductById(id)
    if(!task){
        res.status(404).send({message: "Product with Id not found."})
        return
    }

    const product = await ProductServices.removeProduct(id)
    res.status(200).send({message: "Product removed.", product: product})
}

const ProductController = {
    getProductList, 
    createProduct,
    getProductById,
    updateProduct,
    removeProduct
}

export default ProductController