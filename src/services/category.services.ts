import { CategoryRepository } from "../repository/category.repository";
import createHttpError from "../utils/httpError.utils";


export class CategoryServices{
    private readonly categoryRepository: CategoryRepository
    constructor(){
        this.categoryRepository = new CategoryRepository()
    }

    async getCategoryList(){
        const result = await this.categoryRepository.getCategoryList()
        if(result.length == 0){
            throw createHttpError.NotFound("Category list is empty.")
        }
        return result
    }

    async createCategory(name:string){
        const categoryExist = await this.categoryRepository.getCategory(name)
        if(categoryExist){
            return categoryExist
        }
        return await this.categoryRepository.createCategory(name)
    }

    async removeCategory(categoryId: string){
        const result = await this.categoryRepository.removeCategory(categoryId)
        if(!result){
            throw createHttpError.NotFound("Category with Id not found.")
        }
        return result
    }
}