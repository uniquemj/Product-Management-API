import {Response, Router} from 'express'
import { AuthRequest } from '../types/auth.types'
import createHttpError from '../utils/httpError.utils'
import {OrderServices }from '../services/order.services'
import authorizedRole from '../middlewares/role.middleware'
import { statusUpdateOrder } from '../validate/order.validate'
import validate from '../middlewares/validate.middleware'

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

        instance.router.get('/', authorizedRole('admin'), instance.getOrderList)
        instance.router.get('/user', authorizedRole('user'), instance.getUserOrder)
        instance.router.post('/',authorizedRole('user'), instance.createOrder)
        instance.router.put('/:id', authorizedRole('admin'), validate(statusUpdateOrder), instance.updateStatus)
        return instance
    }

    getOrderList = async(req: AuthRequest, res: Response) =>{
        try{
            const orders = await this.orderServices.getOrderList()
            
            res.status(200).send({message: "Order Fetched.", response: orders})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    
    getUserOrder = async(req: AuthRequest, res: Response) =>{
        try{
            const userId = req.user?._id as string
            const order = await this.orderServices.getUserOrder(userId)
            res.status(200).send({message: "Order Fetched.", response: order})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
    createOrder = async(req: AuthRequest, res: Response) =>{
        try{
            const userId = req.user!._id!
            const result = await this.orderServices.createOrder(userId)
            res.status(200).send({message: "Order Created.", response: result})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }

    updateStatus = async(req: AuthRequest, res: Response) =>{
        try{
            const orderId = req.params.id
            const status = req.body.status

            const result = await this.orderServices.updateStatus(orderId, status)
            res.status(200).send({message: "Order status Updated.", response: result})
        }catch(e:any){
            throw createHttpError.Custom(e.statusCode, e.message)
        }
    }
}

