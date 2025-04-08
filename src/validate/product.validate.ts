import {z} from 'zod'

const productSchema = z.object({
    name: z.string(),
    price: z.number(),
    category: z.string(),
    inventory: z.number().optional()
})

export default productSchema