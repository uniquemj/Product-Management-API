import Category from "../models/category.model";
import { ICategory } from "../types/product.types";



export class CategoryRepository{
    async getCategoryList(): Promise<ICategory[]|[]>{
        return await Category.find({})
    }
    async getCategory(name:string){
        return await Category.findOne({name: name.toLowerCase()})
    }

    async createCategory(name: string){
        return await Category.create({name: name.toLowerCase()})
    }

    async removeCategory(categoryId: string){
        return await Category.findByIdAndDelete(categoryId)
    }
}