import {z} from 'zod'
import { OrderStatus } from '../models/order.model'

export const statusUpdateOrder = z.object({
    status: z.nativeEnum(OrderStatus)
})