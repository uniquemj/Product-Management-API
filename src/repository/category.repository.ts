import Category from "../models/category.model";
import { CategoryInfo } from "../types/category.types";



export class CategoryRepository{
    async getCategoryList(): Promise<CategoryInfo[]|[]>{
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