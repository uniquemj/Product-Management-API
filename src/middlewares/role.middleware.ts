import { AuthRequest } from "../types/auth.types"
import { Response, NextFunction } from "express"

const authorizedRole = (...authorizedRoles: Array<string>) =>{
    return (req: AuthRequest, res: Response, next: NextFunction) =>{
        if(!authorizedRoles.includes(req.user!.role!)){
            res.status(403).send({message: "Access Denied."})
            return
        }
        next()
    }
}

export default authorizedRole