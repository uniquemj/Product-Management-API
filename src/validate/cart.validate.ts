import {z} from 'zod'


export const alterCartSchema = z.object({
    productId: z.string().optional(),
    quantity: z.number()
})