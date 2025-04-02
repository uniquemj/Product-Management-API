import { Request, Response } from "express"
import ProductServices from "../services/product.services"
import { IAuthRequest } from "../types/auth.types"


const getProductList = async(req: IAuthRequest, res: Response) =>{
    try{
        const products = await ProductServices.getProductList()
        if(products.length == 0){
            res.status(404).send({message: "Product List is Empty."})
            return
        }
        res.status(200).send(products)
    } catch(e: any){
        res.status(500).send({message: e.message})
    }
}

const getProductById = async(req: IAuthRequest, res: Response) =>{
    try{
        const {id} = req.params
        const product = await ProductServices.getProductById(id)

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
            res.status(400).send({message: "Nmae and price field is required"})
            return
        }
        
        const productInfo = {
            name,
            price,
            description,
            category, 
            inventory
        }
        const product = await ProductServices.createProduct(productInfo)
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
        
        const task = await ProductServices.getProductById(id)
        if(!task){
            res.status(404).send({message: "Product with Id not found."})
            return
        }
        
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