import { NextFunction, Request, Response } from 'express'
import {z, ZodSchema} from 'zod'


const validate = (schema : ZodSchema) =>{
    return (req: Request, res: Response, next: NextFunction) =>{
        const validation= schema.safeParse(req.body)
        if(!validation.success){
            const formattedError = validation.error.issues.map((issue)=>`${issue.path} : ${issue.message}`)
            res.status(400).send({message: "Validation Error", error: formattedError})
            return
        }
        req.body = validation.data
        next()
    }
}

export default validate
