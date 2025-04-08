import {z} from 'zod'


export const registerSchema = z.object({
    fullname: z.string(),
    email: z.string().email({message: "Invalid Email Address."}),
    password: z.string().min(6, {message:"Password must be of 8 character or more."})
})

export const  loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: "Password must be of 8 character or more."} )
})