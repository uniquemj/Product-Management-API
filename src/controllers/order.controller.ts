import {Response, Router} from 'express'
import { IAuthRequest } from '../types/auth.types'
import createHttpError from '../utils/httpError.utils'
import {OrderServices }from '../services/order.services'
import authorizedRole from '../middlewares/role.middleware'

export class OrderController{
    readonly router: Router;
    private static instance: OrderController
    private readonly orderServices: OrderServices;

    private constructor(){
        this.router = Router()
        this.orderServices = new OrderServices()
    }

    static initController(){
        const instance = new OrderController()
        OrderController.instance = instance

        instance.router.get('/', authorizedRole('user'), instance.getOrderList)
        instance.router.post('/',authorizedRole('user'), instance.createOrder)

        return instance
    }
    getOrderList = async(req: IAuthRequest, res: Response) =>{
        try{
            
            const userId = req.user!._id!
            
            const orders = await this.orderServices.getOrderList(userId)
            
            res.status(200).send({message: "Order Fetched.", response: orders})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    createOrder = async(req: IAuthRequest, res: Response) =>{
        try{
            const userId = req.user!._id!
            const result = await this.orderServices.createOrder(userId)
            res.status(200).send({message: "Order Created.", response: result})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
}

