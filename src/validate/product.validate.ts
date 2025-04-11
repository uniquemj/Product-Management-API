import {z} from 'zod'

const productSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string().optional(),
    category: z.string(),
    inventory: z.number().optional()
})

export default productSchema