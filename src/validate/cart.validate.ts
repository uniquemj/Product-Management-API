import {z} from 'zod'


export const alterCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().optional()
})