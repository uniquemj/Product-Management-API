import Category from "../models/category.model";



export class CategoryRepository{
    async getCategory(name:string){
        return await Category.findOne({name: name.toLowerCase()})
    }

    async createCategory(name: string){
        return await Category.create({name: name.toLowerCase()})
    }
}