import {z} from 'zod'

const productSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string().optional(),
    category: z.string().optional(),
    inventory: z.number()
})

export const updateCategorySchema = z.object({
    category: z.string()
})

export default productSchema