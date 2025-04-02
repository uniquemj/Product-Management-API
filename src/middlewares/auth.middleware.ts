import jwt from "jsonwebtoken"
import { IAuthRequest } from "../types/auth.types"
import type { JwtPayload } from "jsonwebtoken"
import { Response, NextFunction } from "express"

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

const verifyToken = (req: IAuthRequest, res: Response, next: NextFunction) =>{
    const {USER_TOKEN} = req.cookies

    if(!USER_TOKEN){
        res.status(401).send({message: "No token provided, Authorization denied."})
        return
    }

    try{
        const decode = jwt.verify(USER_TOKEN, JWT_SECRET_KEY) as JwtPayload

        req.user = {
            _id: decode._id,
            email: decode.email,
            role: decode.role,
        }

        next()
    }catch(e){
        res.status(400).json({message:"Token is not valid."})
    }
}

export default verifyToken