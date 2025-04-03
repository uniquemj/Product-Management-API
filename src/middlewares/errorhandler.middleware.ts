import {Request, Response, NextFunction} from 'express'


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) =>{
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        errors: err.errors || []
    })
}

export default errorHandler