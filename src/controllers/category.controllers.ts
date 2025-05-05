import { Router, Response } from "express";
import { CategoryServices } from "../services/category.services";
import createHttpError from "../utils/httpError.utils";
import { AuthRequest } from "../types/auth.types";
import authorizedRole from "../middlewares/role.middleware";
import validate from "../middlewares/validate.middleware";
import { categorySchema } from "../validate/category.validate";

export class CategoryController{
    readonly router: Router;
    private static instance: CategoryController
    private readonly categoryServices: CategoryServices

    private constructor(){
        this.router = Router()
        this.categoryServices = new CategoryServices()
    }

    static initController(){
        const instance = new CategoryController()
        CategoryController.instance = instance

        instance.router.get('/', authorizedRole('admin','user'), instance.getCategoryList)
        instance.router.post('/', authorizedRole('admin'), validate(categorySchema),instance.createCategory)
        instance.router.delete('/:id', authorizedRole('admin'), instance.removeCategory)
        return instance
    }

    getCategoryList = async(req: AuthRequest, res: Response)=>{
        try{
            const result = await this.categoryServices.getCategoryList()
            res.status(200).send({message:"Category fetched.", response: result})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message, e.errors)
        }
    }

    createCategory= async(req: AuthRequest, res: Response) =>{
        try{
            const {name} = req.body
            const result = await this.categoryServices.createCategory(name)
            res.status(201).send({message: "Category Created.", response: result})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message, e.errors)
        }
    }

    removeCategory= async(req: AuthRequest, res: Response) =>{
        try{
            const {id} = req.params
            const result = await this.categoryServices.removeCategory(id)
            res.status(200).send({message: "Category Removed.", response: result})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message, e.errors)
        }
    }
}