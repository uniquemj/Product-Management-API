import jwt from "jsonwebtoken"
import { IAuthRequest } from "../types/auth.types"
import type { JwtPayload } from "jsonwebtoken"
import { Response, NextFunction } from "express"
import createHttpError from "../utils.js/httpError.utils"
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

const verifyToken = (req: IAuthRequest, res: Response, next: NextFunction) =>{
    const {USER_TOKEN} = req.cookies

    if(!USER_TOKEN){
        throw createHttpError.Unauthorized("No token provided, Authorization denied.")
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
        throw createHttpError.BadRequest("Token is no valid.")
    }
}

export default verifyToken